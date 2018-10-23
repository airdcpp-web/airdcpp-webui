'use strict';
//@ts-ignore
import Reflux from 'reflux';
import { default as QueueConstants, StatusEnum } from 'constants/QueueConstants';
import SocketService from 'services/SocketService';
import History from 'utils/History';

import IconConstants from 'constants/IconConstants';

import DownloadableItemActions, { DownloadableItemInfo } from 'actions/DownloadableItemActions';
import NotificationActions from 'actions/NotificationActions';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { ErrorResponse } from 'airdcpp-apisocket';
import { Location } from 'history';


const bundleValidationFailed = (bundle: API.QueueBundle) => bundle.status.id === StatusEnum.COMPLETION_VALIDATION_ERROR;
const itemNotFinished = (bundle: API.QueueBundle) => bundle.time_finished === 0;
const isDirectoryBundle = (bundle: API.QueueBundle) => bundle.type.id === 'directory';
const hasSources = (bundle: API.QueueBundle) => bundle.sources.total > 0 && itemNotFinished(bundle);


const QueueBundleActionConfig: UI.ActionConfigList<API.QueueBundle> = [
  { 'sources': { 
    asyncResult: false,
    displayName: 'Manage sources...', 
    icon: IconConstants.USER,
    filter: hasSources,
  } },
  { 'content': { 
    asyncResult: false,
    displayName: 'Manage files...', 
    icon: IconConstants.FILE,
    filter: isDirectoryBundle,
  } },
  'divider',
  { 'search': { 
    asyncResult: true,
    access: API.AccessEnum.SEARCH, 
    displayName: 'Search (foreground)', 
    icon: IconConstants.SEARCH,
  } },
  { 'searchBundleAlternates': { 
    asyncResult: true,
    access: API.AccessEnum.QUEUE_EDIT, 
    displayName: 'Search for alternates', 
    icon: IconConstants.SEARCH_ALTERNATES,
    filter: itemNotFinished,
  } },
  'divider',
  { 'removeBundle': { 
    asyncResult: true, 
    displayName: 'Remove',
    access: API.AccessEnum.QUEUE_EDIT,
    icon: IconConstants.REMOVE,
    confirmation: bundle => ({
      content: `Are you sure that you want to remove the bundle ${bundle.name}?`,
      approveCaption: 'Remove bundle',
      rejectCaption: `Don't remove`,
      checkboxCaption: 'Remove finished files',
    })
  } },
  'divider',
  { 'rescan': { 
    asyncResult: true, 
    displayName: 'Rescan for errors',
    access: API.AccessEnum.QUEUE_EDIT,
    icon: IconConstants.REFRESH,
    filter: bundleValidationFailed,
  } },
  { 'forceShare': { 
    asyncResult: true, 
    displayName: 'Force in share',
    access: API.AccessEnum.QUEUE_EDIT,
    icon: IconConstants.ERROR,
    filter: bundleValidationFailed,
  } },
  'divider',
  { 'setBundlePriority': { 
    asyncResult: true,
  } },
  { 'removeBundleSource': { 
    asyncResult: true,
    access: API.AccessEnum.QUEUE_EDIT, 
    displayName: 'Remove source', 
    icon: IconConstants.REMOVE,
  } },
];

const QueueBundleActions = Reflux.createActions(QueueBundleActionConfig);

const shareBundle = (bundle: API.QueueBundle, skipValidation: boolean, action: UI.AsyncActionType<API.QueueBundle>) => {
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/share`, { 
    skip_validation: skipValidation, 
  })
    .then(() => 
      action.completed(bundle))
    .catch((error) => 
      action.failed(error)
    );
};


QueueBundleActions.setBundlePriority.listen(function (
  this: UI.AsyncActionType<API.QueueFile>, 
  bundle: API.QueueBundle, 
  priority: API.QueuePriorityEnum
) {
  let that = this;
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/priority`, {
    priority
  })
    .then(that.completed)
    .catch(that.failed);
});

QueueBundleActions.rescan.listen(function (bundle: API.QueueBundle) {
  shareBundle(bundle, false, QueueBundleActions.rescan);
});

QueueBundleActions.forceShare.listen(function (bundle: API.QueueBundle) {
  shareBundle(bundle, true, QueueBundleActions.forceShare);
});

interface ActionBundleSourceData {
  source: API.QueueBundleSource;
  bundle: API.QueueBundle;
}

QueueBundleActions.removeBundleSource.listen(function (
  this: UI.AsyncActionType<ActionBundleSourceData>, 
  { source, bundle }: ActionBundleSourceData
) {
  let that = this;
  return SocketService.delete(`${QueueConstants.BUNDLES_URL}/${bundle.id}/sources/${source.user.cid}`)
    .then(that.completed.bind(that, source, bundle))
    .catch(that.failed.bind(that, source, bundle));
});

QueueBundleActions.removeBundle.listen(function (
  this: UI.AsyncActionType<API.QueueBundle>,
  bundle: API.QueueBundle, 
  location: any,
  removeFinished: boolean
) {
  let that = this;
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/remove`, { 
    remove_finished: removeFinished,
  })
    .then(QueueBundleActions.removeBundle.completed.bind(that, bundle))
    .catch(QueueBundleActions.removeBundle.failed.bind(that, bundle));
});

QueueBundleActions.search.listen(function (itemInfo: DownloadableItemInfo, location: Location) {
  return DownloadableItemActions.search({ itemInfo }, location);
});

QueueBundleActions.searchBundleAlternates.listen(function (
  this: UI.AsyncActionType<API.QueueBundle>, 
  bundle: API.QueueBundle
) {
  let that = this;
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/search`)
    .then(that.completed.bind(that, bundle))
    .catch(that.failed.bind(that, bundle));
});

QueueBundleActions.searchBundleAlternates.completed.listen(function (bundle: API.QueueBundle) {
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
});

QueueBundleActions.sources.listen(function (data: API.QueueBundle, location: Location) {
  History.push(`${location.pathname}/sources/${data.id}`);
});

QueueBundleActions.content.listen(function (data: API.QueueBundle, location: Location) {
  History.push(`${location.pathname}/content/${data.id}`);
});

export default QueueBundleActions;
