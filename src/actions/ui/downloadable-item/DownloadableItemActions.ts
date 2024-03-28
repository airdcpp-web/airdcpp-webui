import SocketService from 'services/SocketService';
import { sleep } from 'utils/Promise';

import IconConstants from 'constants/IconConstants';
import SearchConstants from 'constants/SearchConstants';

import ViewFileActions from 'actions/reflux/ViewFileActions';
import ViewFileStore from 'stores/ViewFileStore';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { toErrorResponse } from 'utils/TypeConvert';
import SearchActions from 'actions/reflux/SearchActions';
import { translate } from 'utils/TranslationUtils';
import { makeHashMagnetLink, makeTextMagnetLink } from 'utils/MagnetUtils';
import { hasCopySupport } from 'utils/BrowserUtils';
import { DupeEnum } from 'types/api';
import { MENU_DIVIDER } from 'constants/ActionConstants';

const isShareDupe = (dupe: API.Dupe | null) =>
  !!dupe &&
  (dupe.id === DupeEnum.SHARE_FULL ||
    dupe.id === DupeEnum.SHARE_PARTIAL ||
    dupe.id === DupeEnum.SHARE_QUEUE);

const isAsch = ({ user }: UI.DownloadableItemData) =>
  !user ? false : user.flags.includes('asch');
const isSearchable = ({ itemInfo }: UI.DownloadableItemData) =>
  !!itemInfo.name || !!itemInfo.tth;
const notSelf = ({ user }: UI.DownloadableItemData) =>
  !user ? true : !user.flags.includes('self');
const isDirectory = ({ itemInfo }: UI.DownloadableItemData) =>
  itemInfo.type.id === 'directory';
const isPicture = ({ itemInfo }: UI.DownloadableItemData) =>
  (itemInfo.type as API.FileType).content_type === 'picture';
const isVideo = ({ itemInfo }: UI.DownloadableItemData) =>
  (itemInfo.type as API.FileType).content_type === 'video';
const isAudio = ({ itemInfo }: UI.DownloadableItemData) =>
  (itemInfo.type as API.FileType).content_type === 'audio';

const hasValidViewUser = (data: UI.DownloadableItemData) => {
  const { itemInfo, user } = data;
  if (!user) {
    return false;
  }

  // Can't view files from bots
  const notBot = !user.flags.includes('bot') && !user.flags.includes('hidden');
  if (!notBot) {
    return false;
  }

  // Can't view files from yourself unless it's a share dupe
  return notSelf(data) || isShareDupe(itemInfo.dupe);
};

// 200 MB, the web server isn't suitable for sending large files
const viewableSizeValid = ({ itemInfo }: UI.DownloadableItemData) =>
  itemInfo.size < 200 * 1024 * 1024;

const canViewText = (data: UI.DownloadableItemData) =>
  hasValidViewUser(data) &&
  !isDirectory(data) &&
  !isPicture(data) &&
  !isVideo(data) &&
  !isAudio(data) &&
  data.itemInfo.size < 256 * 1024;
const canFindNfo = (data: UI.DownloadableItemData) =>
  hasValidViewUser(data) && isDirectory(data) && notSelf(data) && isAsch(data);

const canViewVideo = (data: UI.DownloadableItemData) =>
  hasValidViewUser(data) && isVideo(data) && viewableSizeValid(data);
const canViewAudio = (data: UI.DownloadableItemData) =>
  hasValidViewUser(data) && isAudio(data) && viewableSizeValid(data);
const canViewImage = (data: UI.DownloadableItemData) =>
  hasValidViewUser(data) && isPicture(data) && viewableSizeValid(data);

const canCopyTTH = (data: UI.DownloadableItemData) =>
  hasCopySupport() && !isDirectory(data);
const canCopyPath = (data: UI.DownloadableItemData) =>
  hasCopySupport() && !!data.itemInfo.path;

const handleDownload: UI.ActionHandler<UI.DownloadableItemData> = ({ data }) => {
  const { handler, itemInfo, user, session } = data;
  return handler(
    itemInfo,
    user,
    {
      target_name: itemInfo.name,
    },
    session,
  );
};

const handleDownloadTo: UI.ActionHandler<UI.DownloadableItemData> = ({
  data,
  navigate,
}) => {
  navigate(`download/${data.itemInfo.id}`);
};

const handleViewFile = (
  { data, location, navigate }: UI.ActionHandlerData<UI.DownloadableItemData>,
  isText: boolean,
) => {
  const props = {
    isText,
    location,
    sessionStore: ViewFileStore,
    history,
    navigate,
  };

  if (notSelf(data)) {
    // Remote file
    return ViewFileActions.createSession(data, props);
  }

  // Local file
  return ViewFileActions.openLocalFile(data.itemInfo.tth, props);
};

const handleViewText: UI.ActionHandler<UI.DownloadableItemData> = (data) => {
  return handleViewFile(data, true);
};

const handleViewVideo: UI.ActionHandler<UI.DownloadableItemData> = (data) => {
  return handleViewFile(data, false);
};

const handleViewAudio: UI.ActionHandler<UI.DownloadableItemData> = (data) => {
  return handleViewFile(data, false);
};

const handleViewImage: UI.ActionHandler<UI.DownloadableItemData> = (data) => {
  return handleViewFile(data, false);
};

const handleFindNfo: UI.ActionHandler<UI.DownloadableItemData> = async ({
  data,
  ...other
}) => {
  // Get a new instance
  let instance = await SocketService.post<API.SearchInstance>(
    SearchConstants.INSTANCES_URL,
    {
      expiration_minutes: 1,
    },
  );

  // Post the search
  await SocketService.post(
    `${SearchConstants.INSTANCES_URL}/${instance.id}/user_search`,
    {
      user: data.user,
      query: {
        extensions: ['nfo'],
        max_size: 256 * 1024,
      },
      options: {
        path: data.itemInfo.path,
        max_results: 1,
      },
    },
  );

  // Wait for the results to arrive
  for (let i = 0; i < 5; i++) {
    await sleep(500);

    instance = await SocketService.get<API.SearchInstance>(
      `${SearchConstants.INSTANCES_URL}/${instance.id}`,
    );
    if (instance.result_count > 0) {
      break;
    }
  }

  if (instance.result_count > 0) {
    // Open the first result for viewing
    const results = await SocketService.get<API.GroupedSearchResult[]>(
      `${SearchConstants.INSTANCES_URL}/${instance.id}/results/0/1`,
    );

    handleViewText({
      data: {
        id: results[0].id,
        itemInfo: results[0],
        user: data.user,
        handler: data.handler,
        session: instance,
      },
      ...other,
    });
  } else {
    throw toErrorResponse(
      404,
      translate('No NFO results were received', other.t, UI.Modules.COMMON),
    );
  }
};

export const handleSearch: UI.ActionHandler<UI.DownloadableItemData> = ({
  data,
  location,
  navigate,
}) => {
  return SearchActions.search(data.itemInfo, location, navigate);
};

const handleCopyMagnet: UI.ActionHandler<UI.DownloadableItemData> = ({ data }) => {
  const link = isDirectory(data)
    ? makeTextMagnetLink(data.itemInfo)
    : makeHashMagnetLink(data.itemInfo);
  return navigator.clipboard.writeText(link);
};

const handleCopyTTH: UI.ActionHandler<UI.DownloadableItemData> = ({ data }) => {
  return navigator.clipboard.writeText(data.itemInfo.tth);
};

const handleCopyPath: UI.ActionHandler<UI.DownloadableItemData> = ({ data }) => {
  return navigator.clipboard.writeText(data.itemInfo.path!);
};

const handleCopySize: UI.ActionHandler<UI.DownloadableItemData> = ({ data }) => {
  return navigator.clipboard.writeText(data.itemInfo.size.toString());
};

export const DownloadItemAction = {
  id: 'download',
  displayName: 'Download',
  access: API.AccessEnum.DOWNLOAD,
  icon: IconConstants.DOWNLOAD,
  filter: notSelf,
  handler: handleDownload,
};

export const DownloadItemToAction = {
  id: 'downloadTo',
  displayName: 'Download to...',
  access: API.AccessEnum.DOWNLOAD,
  icon: IconConstants.DOWNLOAD_TO,
  filter: notSelf,
  handler: handleDownloadTo,
};

export const ViewTextAction = {
  id: 'viewText',
  displayName: 'View as text',
  access: API.AccessEnum.VIEW_FILE_EDIT,
  icon: IconConstants.VIEW,
  filter: canViewText,
  handler: handleViewText,
};

export const ViewImageAction = {
  id: 'viewImage',
  displayName: 'View image',
  access: API.AccessEnum.VIEW_FILE_EDIT,
  icon: IconConstants.VIEW,
  filter: canViewImage,
  handler: handleViewImage,
};

export const ViewNfoAction = {
  id: 'findNfo',
  displayName: 'Find NFO',
  access: API.AccessEnum.VIEW_FILE_EDIT,
  icon: IconConstants.FIND,
  filter: canFindNfo,
  handler: handleFindNfo,
  notifications: {
    errorTitleGetter: (data: UI.DownloadableItemData) => data.itemInfo.name,
  },
};

export const ViewVideoAction = {
  id: 'viewVideo',
  displayName: 'Play video',
  access: API.AccessEnum.VIEW_FILE_EDIT,
  icon: IconConstants.VIEW,
  filter: canViewVideo,
  handler: handleViewVideo,
};

export const ViewAudioAction = {
  id: 'viewAudio',
  displayName: 'Play audio',
  access: API.AccessEnum.VIEW_FILE_EDIT,
  icon: IconConstants.VIEW,
  filter: canViewAudio,
  handler: handleViewAudio,
};

export const SearchAction = {
  id: 'search',
  displayName: 'Search',
  access: API.AccessEnum.SEARCH,
  icon: IconConstants.SEARCH,
  filter: isSearchable,
  handler: handleSearch,
};

export const CopyMagnetAction = {
  id: 'copyMagnet',
  displayName: 'Copy magnet link',
  icon: IconConstants.COPY,
  filter: canCopyTTH,
  handler: handleCopyMagnet,
  notifications: {
    onSuccess: 'Magnet link was copied to clipboard',
  },
};

export const CopyPathAction = {
  id: 'copyPath',
  displayName: 'Copy path',
  icon: IconConstants.COPY,
  filter: canCopyPath,
  handler: handleCopyPath,
  notifications: {
    onSuccess: 'Path was copied to clipboard',
  },
};

export const CopySizeAction = {
  id: 'copySize',
  displayName: 'Copy size',
  icon: IconConstants.COPY,
  handler: handleCopySize,
  notifications: {
    onSuccess: 'Size was copied to clipboard',
  },
};

export const CopyTTHAction = {
  id: 'copyTTH',
  displayName: 'Copy TTH',
  icon: IconConstants.COPY,
  filter: canCopyTTH,
  handler: handleCopyTTH,
  notifications: {
    onSuccess: 'TTH was copied to clipboard',
  },
};

const DownloadableItemActions: UI.ActionListType<UI.DownloadableItemData> = {
  download: DownloadItemAction,
  downloadTo: DownloadItemToAction,
  divider: MENU_DIVIDER,
  viewText: ViewTextAction,
  viewImage: ViewImageAction,
  findNfo: ViewNfoAction,
  viewVideo: ViewVideoAction,
  viewAudio: ViewAudioAction,
  search: SearchAction,
  copy: {
    id: 'copy',
    displayName: 'Copy',
    icon: IconConstants.COPY,
    children: {
      copyMagnet: CopyMagnetAction,
      copyPath: CopyPathAction,
      copySize: CopySizeAction,
      copyTTH: CopyTTHAction,
    },
  },
};

export const DownloadableItemActionModule = {
  moduleId: UI.Modules.COMMON,
};

export const DownloadableItemActionMenu = {
  moduleData: DownloadableItemActionModule,
  actions: DownloadableItemActions,
};
