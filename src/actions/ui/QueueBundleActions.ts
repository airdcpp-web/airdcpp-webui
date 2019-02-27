'use strict';
import { default as QueueConstants, StatusEnum } from 'constants/QueueConstants';
import SocketService from 'services/SocketService';
import History from 'utils/History';

import IconConstants from 'constants/IconConstants';

//import DownloadableItemActions from './DownloadableItemActions';

import * as API from 'types/api';
import * as UI from 'types/ui';
import SearchActions from 'actions/reflux/SearchActions';


const bundleValidationFailed = (bundle: API.QueueBundle) => bundle.status.id === StatusEnum.COMPLETION_VALIDATION_ERROR;
const itemNotFinished = (bundle: API.QueueBundle) => bundle.time_finished === 0;
const isDirectoryBundle = (bundle: API.QueueBundle) => bundle.type.id === 'directory';
const hasSources = (bundle: API.QueueBundle) => bundle.sources.total > 0 && itemNotFinished(bundle);



const shareBundle = (
  bundle: API.QueueBundle, 
  skipValidation: boolean
) => {
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

/*interface ActionBundleSourceData {
  source: API.QueueBundleSource;
  bundle: API.QueueBundle;
}

const handleRemoveBundleSource: UI.ActionHandler<ActionBundleSourceData> = ({ data }) => {
  const { source, bundle } = data;
  return SocketService.delete(`${QueueConstants.BUNDLES_URL}/${bundle.id}/sources/${source.user.cid}`);
};*/

const handleRemoveBundle: UI.ActionHandler<API.QueueBundle> = (
  { data: bundle },
  removeFinished
) => {
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/remove`, { 
    remove_finished: removeFinished,
  });
};

const handleSearch: UI.ActionHandler<API.QueueBundle> = ({ data: itemInfo, location }) => {
  /*return DownloadableItemActions.actions.search!.handler({
    data: {
      itemInfo,
      handler: () => void
    },
    location
  });*/

  SearchActions.search(itemInfo, location);
};

const handleSearchBundleAlternates: UI.ActionHandler<API.QueueBundle> = (
  { data: bundle }
) => {
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/search`);
  //  .then(that.completed.bind(that, bundle))
  //  .catch(that.failed.bind(that, bundle));
};

/*QueueBundleActions.searchBundleAlternates.completed.listen(function (bundle: API.QueueBundle) {
  NotificationActions.success({ 
    title: 'Action completed',
    message: `The bundle ${bundle.name} was searched for alternates`,
  });
});

QueueBundleActions.searchBundleAlternates.failed.listen(function (bundle: API.QueueBundle, error: ErrorResponse) {
  NotificationActions.error({ 
    title: 'Action failed',
    message: `Failed to search the bundle ${bundle.name} for alternates: ${error.message}`,
  });
});*/

const handleSources: UI.ActionHandler<API.QueueBundle> = ({ data, location }) => {
  History.push(`${location.pathname}/sources/${data.id}`);
};

const handleContent: UI.ActionHandler<API.QueueBundle> = ({ data, location }) => {
  History.push(`${location.pathname}/content/${data.id}`);
};



const QueueBundleActions: UI.ActionListType<API.QueueBundle> = {
  sources: { 
    displayName: 'Manage sources...', 
    icon: IconConstants.USER,
    filter: hasSources,
    handler: handleSources,
  },
  content: { 
    displayName: 'Manage files...', 
    icon: IconConstants.FILE,
    filter: isDirectoryBundle,
    handler: handleContent,
  },
  divider: null,
  search: { 
    access: API.AccessEnum.SEARCH, 
    displayName: 'Search (foreground)', 
    icon: IconConstants.SEARCH,
    handler: handleSearch,
  },
  searchBundleAlternates: { 
    access: API.AccessEnum.QUEUE_EDIT, 
    displayName: 'Search for alternates', 
    icon: IconConstants.SEARCH_ALTERNATES,
    filter: itemNotFinished,
    handler: handleSearchBundleAlternates,
  },
  divider2: null,
  removeBundle: {
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
  },
  divider3: null,
  rescan: {
    displayName: 'Rescan for errors',
    access: API.AccessEnum.QUEUE_EDIT,
    icon: IconConstants.REFRESH,
    filter: bundleValidationFailed,
    handler: handleRescan,
  },
  forceShare: { 
    displayName: 'Force in share',
    access: API.AccessEnum.QUEUE_EDIT,
    icon: IconConstants.ERROR,
    filter: bundleValidationFailed,
    handler: handleForceShare,
  }
};

/*const BundleSourceActions: UI.ActionListType<ActionBundleSourceData> = {
  removeBundleSource: { 
    //asyncResult: true,
    access: API.AccessEnum.QUEUE_EDIT, 
    displayName: 'Remove source', 
    icon: IconConstants.REMOVE,
    handler: handleRemoveBundleSource,
  },
};*/


export default {
  moduleId: UI.Modules.QUEUE,
  //subId: 'bundle',
  actions: QueueBundleActions,
} as UI.ModuleActions<API.QueueBundle>;
