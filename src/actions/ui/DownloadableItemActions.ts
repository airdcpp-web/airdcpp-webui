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
const sizeValid = ({ itemInfo }: UI.DownloadableItemData) =>
  itemInfo.size < 200 * 1024 * 1024;

const viewText = (data: UI.DownloadableItemData) =>
  hasValidViewUser(data) &&
  !isDirectory(data) &&
  !isPicture(data) &&
  !isVideo(data) &&
  !isAudio(data) &&
  data.itemInfo.size < 256 * 1024;
const findNfo = (data: UI.DownloadableItemData) =>
  hasValidViewUser(data) && isDirectory(data) && notSelf(data) && isAsch(data);

const viewVideo = (data: UI.DownloadableItemData) =>
  hasValidViewUser(data) && isVideo(data) && sizeValid(data);
const viewAudio = (data: UI.DownloadableItemData) =>
  hasValidViewUser(data) && isAudio(data) && sizeValid(data);
const viewImage = (data: UI.DownloadableItemData) =>
  hasValidViewUser(data) && isPicture(data) && sizeValid(data);

const copyMagnet = (data: UI.DownloadableItemData) => hasCopySupport();

const handleDownload: UI.ActionHandler<UI.DownloadableItemData> = ({ data }) => {
  const { handler, itemInfo, user, session } = data;
  return handler(
    itemInfo,
    user,
    {
      target_name: itemInfo.name,
    },
    session
  );
};

const handleDownloadTo: UI.ActionHandler<UI.DownloadableItemData> = ({
  data,
  location,
  history,
}) => {
  const { pathname } = location;
  history.push(`${pathname}/download/${data.itemInfo.id}`);
};

const handleViewFile = (
  { data, location, history }: UI.ActionHandlerData<UI.DownloadableItemData>,
  isText: boolean
) => {
  const props = {
    isText,
    location,
    sessionStore: ViewFileStore,
    history,
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
    }
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
    }
  );

  // Wait for the results to arrive
  for (let i = 0; i < 5; i++) {
    await sleep(500);

    instance = await SocketService.get<API.SearchInstance>(
      `${SearchConstants.INSTANCES_URL}/${instance.id}`
    );
    if (instance.result_count > 0) {
      break;
    }
  }

  if (instance.result_count > 0) {
    // Open the first result for viewing
    const results = await SocketService.get<API.GroupedSearchResult[]>(
      `${SearchConstants.INSTANCES_URL}/${instance.id}/results/0/1`
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
      translate('No NFO results were received', other.t, UI.Modules.COMMON)
    );
  }
};

export const handleSearch: UI.ActionHandler<UI.DownloadableItemData> = ({
  data,
  location,
  history,
}) => {
  return SearchActions.search(data.itemInfo, location, history);
};

const handleCopyMagnet: UI.ActionHandler<UI.DownloadableItemData> = ({ data }) => {
  const link = isDirectory(data)
    ? makeTextMagnetLink(data.itemInfo)
    : makeHashMagnetLink(data.itemInfo);
  return navigator.clipboard.writeText(link);
};

const DownloadableItemActions: UI.ActionListType<UI.DownloadableItemData> = {
  download: {
    displayName: 'Download',
    access: API.AccessEnum.DOWNLOAD,
    icon: IconConstants.DOWNLOAD,
    filter: notSelf,
    handler: handleDownload,
  },
  downloadTo: {
    displayName: 'Download to...',
    access: API.AccessEnum.DOWNLOAD,
    icon: IconConstants.DOWNLOAD_TO,
    filter: notSelf,
    handler: handleDownloadTo,
  },
  divider: null,
  viewText: {
    displayName: 'View as text',
    access: API.AccessEnum.VIEW_FILE_EDIT,
    icon: IconConstants.VIEW,
    filter: viewText,
    handler: handleViewText,
  },
  viewImage: {
    displayName: 'View image',
    access: API.AccessEnum.VIEW_FILE_EDIT,
    icon: IconConstants.VIEW,
    filter: viewImage,
    handler: handleViewImage,
  },
  findNfo: {
    displayName: 'Find NFO',
    access: API.AccessEnum.VIEW_FILE_EDIT,
    icon: IconConstants.FIND,
    filter: findNfo,
    handler: handleFindNfo,
    notifications: {
      errorTitleGetter: (data) => data.itemInfo.name,
    },
  },
  viewVideo: {
    displayName: 'Play video',
    access: API.AccessEnum.VIEW_FILE_EDIT,
    icon: IconConstants.VIEW,
    filter: viewVideo,
    handler: handleViewVideo,
  },
  viewAudio: {
    displayName: 'Play audio',
    access: API.AccessEnum.VIEW_FILE_EDIT,
    icon: IconConstants.VIEW,
    filter: viewAudio,
    handler: handleViewAudio,
  },
  search: {
    displayName: 'Search',
    access: API.AccessEnum.SEARCH,
    icon: IconConstants.SEARCH,
    filter: isSearchable, // Example: root directory in filelists can't be searched for
    handler: handleSearch,
  },
  copyMagnet: {
    displayName: 'Copy magnet link',
    icon: IconConstants.MAGNET,
    filter: copyMagnet,
    handler: handleCopyMagnet,
    notifications: {
      onSuccess: 'Magnet link was copied to clipboard',
    },
  },
};

export default {
  moduleId: UI.Modules.COMMON,
  actions: DownloadableItemActions,
};
