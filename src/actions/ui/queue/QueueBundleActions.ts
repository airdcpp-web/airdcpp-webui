import { default as QueueConstants, StatusEnum } from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

import SearchActions from 'actions/reflux/SearchActions';

const bundleValidationFailed = (bundle: API.QueueBundle) =>
  bundle.status.id === StatusEnum.COMPLETION_VALIDATION_ERROR;
const itemNotFinished = (bundle: API.QueueBundle) => bundle.time_finished === 0;
const isDirectoryBundle = (bundle: API.QueueBundle) => bundle.type.id === 'directory';
const hasSources = (bundle: API.QueueBundle) =>
  bundle.sources.total > 0 && itemNotFinished(bundle);

const shareBundle = (bundle: API.QueueBundle, skipValidation: boolean) => {
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/share`, {
    skip_validation: skipValidation,
  });
};

const handleRescan: UI.ActionHandler<API.QueueBundle> = ({ data: bundle }) => {
  return shareBundle(bundle, false);
};

const handleForceShare: UI.ActionHandler<API.QueueBundle> = ({ data: bundle }) => {
  return shareBundle(bundle, true);
};

const handleRemoveBundle: UI.ActionHandler<API.QueueBundle> = (
  { data: bundle },
  removeFinished,
) => {
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/remove`, {
    remove_finished: removeFinished,
  });
};

const handleSearch: UI.ActionHandler<API.QueueBundle> = ({
  data: itemInfo,
  location,
  navigate,
}) => {
  return SearchActions.search(itemInfo, location, navigate);
};

const handleSearchBundleAlternates: UI.ActionHandler<API.QueueBundle> = ({
  data: bundle,
}) => {
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/search`);
};

const handleSources: UI.ActionHandler<API.QueueBundle> = ({ data, navigate }) => {
  navigate(`sources/${data.id}`);
};

const handleContent: UI.ActionHandler<API.QueueBundle> = ({ data, navigate }) => {
  navigate(`content/${data.id}`);
};

export const QueueBundleViewSourcesAction = {
  id: 'sources',
  displayName: 'Manage sources...',
  icon: IconConstants.USER,
  filter: hasSources,
  handler: handleSources,
};

export const QueueBundleViewContentAction = {
  id: 'content',
  displayName: 'Manage files...',
  icon: IconConstants.FILE,
  filter: isDirectoryBundle,
  handler: handleContent,
};

export const QueueBundleSearchAction = {
  id: 'search',
  displayName: 'Search (foreground)',
  icon: IconConstants.SEARCH,
  handler: handleSearch,
};

export const QueueBundleSearchAlternatesAction = {
  id: 'searchAlternates',
  displayName: 'Search for alternates',
  icon: IconConstants.SEARCH_ALTERNATES,
  filter: itemNotFinished,
  handler: handleSearchBundleAlternates,
  notifications: {
    onSuccess: 'The bundle {{item.name}} was searched for alternates',
  },
};

export const QueueBundleRemoveAction = {
  id: 'remove',
  displayName: 'Remove',
  access: API.AccessEnum.QUEUE_EDIT,
  icon: IconConstants.REMOVE,
  confirmation: {
    content: 'Are you sure that you want to remove the bundle {{item.name}}?',
    approveCaption: 'Remove bundle',
    rejectCaption: `Don't remove`,
    checkboxCaption: 'Remove finished files',
  },
  handler: handleRemoveBundle,
};

export const QueueBundleRescanAction = {
  id: 'rescan',
  displayName: 'Rescan for errors',
  access: API.AccessEnum.QUEUE_EDIT,
  icon: IconConstants.REFRESH_COLORED,
  filter: bundleValidationFailed,
  handler: handleRescan,
};

export const QueueBundleForceShareAction = {
  id: 'forceShare',
  displayName: 'Force in share',
  access: API.AccessEnum.QUEUE_EDIT,
  icon: IconConstants.ERROR,
  filter: bundleValidationFailed,
  handler: handleForceShare,
};

const QueueBundleActions: UI.ActionListType<API.QueueBundle> = {
  sources: QueueBundleViewSourcesAction,
  content: QueueBundleViewContentAction,
  divider: null,
  search: QueueBundleSearchAction,
  searchBundleAlternates: QueueBundleSearchAlternatesAction,
  divider2: null,
  removeBundle: QueueBundleRemoveAction,
  divider3: null,
  rescan: QueueBundleRescanAction,
  forceShare: QueueBundleForceShareAction,
};

export const QueueBundleActionModule = {
  moduleId: UI.Modules.QUEUE,
  //subId: 'bundle',
};

export const QueueBundleActionMenu = {
  moduleData: QueueBundleActionModule,
  actions: QueueBundleActions,
} as UI.ModuleActions<API.QueueBundle>;
