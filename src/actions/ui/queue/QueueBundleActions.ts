import { default as QueueConstants, StatusEnum } from 'constants/QueueConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

import SearchActions from 'actions/reflux/SearchActions';

type Filter = UI.ActionFilter<API.QueueBundle>;
const bundleValidationFailed: Filter = ({ itemData: bundle }) =>
  bundle.status.id === StatusEnum.COMPLETION_VALIDATION_ERROR;
const itemNotFinished: Filter = ({ itemData: bundle }) => bundle.time_finished === 0;
const isDirectoryBundle: Filter = ({ itemData: bundle }) =>
  bundle.type.id === 'directory';
const hasSources: Filter = (data) =>
  data.itemData.sources.total > 0 && itemNotFinished(data);

const shareBundle = (bundle: API.QueueBundle, skipValidation: boolean) => {
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/share`, {
    skip_validation: skipValidation,
  });
};

// Handlers
type Handler = UI.ActionHandler<API.QueueBundle>;

const handleRescan: Handler = ({ itemData: bundle }) => {
  return shareBundle(bundle, false);
};

const handleForceShare: Handler = ({ itemData: bundle }) => {
  return shareBundle(bundle, true);
};

const handleRemoveBundle: Handler = ({ itemData: bundle }, removeFinished) => {
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/remove`, {
    remove_finished: removeFinished,
  });
};

const handleSearch: Handler = ({ itemData: bundle, location, navigate }) => {
  return SearchActions.search(bundle, location, navigate);
};

const handleSearchBundleAlternates: Handler = ({ itemData: bundle }) => {
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/search`);
};

const handleSources: Handler = ({ itemData, navigate }) => {
  navigate(`sources/${itemData.id}`);
};

const handleContent: Handler = ({ itemData, navigate }) => {
  navigate(`content/${itemData.id}`);
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
  id: 'searchBundleAlternates',
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
