'use strict';
import Reflux from 'reflux';
import { default as QueueConstants, StatusEnum } from 'constants/QueueConstants';
import SocketService from 'services/SocketService';
import History from 'utils/History';

import AccessConstants from 'constants/AccessConstants';
import IconConstants from 'constants/IconConstants';
import OverlayConstants from 'constants/OverlayConstants';

import ConfirmDialog from 'components/semantic/ConfirmDialog';

import DownloadableItemActions from 'actions/DownloadableItemActions';
import NotificationActions from 'actions/NotificationActions';


const bundleValidationFailed = bundle => bundle.status.id === StatusEnum.COMPLETION_VALIDATION_ERROR;
const itemNotFinished = item => item.time_finished === 0;
const isDirectoryBundle = bundle => bundle.type.id === 'directory';
const hasSources = bundle => bundle.sources.total > 0 && itemNotFinished(bundle);


const QueueBundleActions = Reflux.createActions([
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
    access: AccessConstants.SEARCH, 
    displayName: 'Search (foreground)', 
    icon: IconConstants.SEARCH,
  } },
  { 'searchBundleAlternates': { 
    asyncResult: true,
    access: AccessConstants.QUEUE_EDIT, 
    displayName: 'Search for alternates', 
    icon: IconConstants.SEARCH_ALTERNATES,
    filter: itemNotFinished,
  } },
  'divider',
  { 'removeBundle': { 
    asyncResult: true, 
    children: [ 'confirmed' ], 
    displayName: 'Remove',
    access: AccessConstants.QUEUE_EDIT,
    icon: IconConstants.REMOVE,
  } },
  'divider',
  { 'rescan': { 
    asyncResult: true, 
    displayName: 'Rescan for errors',
    access: AccessConstants.QUEUE_EDIT,
    icon: IconConstants.REFRESH,
    filter: bundleValidationFailed,
  } },
  { 'forceShare': { 
    asyncResult: true, 
    displayName: 'Force in share',
    access: AccessConstants.QUEUE_EDIT,
    icon: IconConstants.ERROR,
    filter: bundleValidationFailed,
  } },
  'divider',
  { 'setBundlePriority': { 
    asyncResult: true,
  } },
  { 'removeBundleSource': { 
    asyncResult: true,
    access: AccessConstants.QUEUE_EDIT, 
    displayName: 'Remove source', 
    icon: IconConstants.REMOVE,
  } },
]);

const shareBundle = (bundle, skipValidation, action) => {
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/share`, { 
    skip_validation: skipValidation, 
  })
    .then(() => 
      action.completed(bundle))
    .catch((error) => 
      action.failed(error, bundle)
    );
};


QueueBundleActions.setBundlePriority.listen(function (bundle, priority) {
  let that = this;
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/priority`, {
    priority
  })
    .then(that.completed)
    .catch(that.failed);
});

QueueBundleActions.rescan.listen(function (bundle) {
  shareBundle(bundle, false, QueueBundleActions.rescan);
});

QueueBundleActions.forceShare.listen(function (bundle) {
  shareBundle(bundle, true, QueueBundleActions.forceShare);
});

QueueBundleActions.removeBundleSource.listen(function ({ source, bundle }) {
  let that = this;
  return SocketService.delete(`${QueueConstants.BUNDLES_URL}/${bundle.id}/sources/${source.user.cid}`)
    .then(that.completed.bind(that, source, bundle))
    .catch(that.failed.bind(that, source, bundle));
});

QueueBundleActions.removeBundle.shouldEmit = function (bundle) {
  if (bundle.status.completed) {
    // No need to confirm completed bundles
    this.confirmed(bundle, false);
  } else {
    const options = {
      title: this.displayName,
      content: 'Are you sure that you want to remove the bundle ' + bundle.name + '?',
      icon: this.icon,
      approveCaption: 'Remove bundle',
      rejectCaption: "Don't remove",
      checkboxCaption: 'Remove finished files',
    };

    ConfirmDialog(options, this.confirmed.bind(this, bundle));
  }
  return false;
};

QueueBundleActions.removeBundle.confirmed.listen(function (bundle, removeFinished) {
  let that = this;
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/remove`, { 
    remove_finished: removeFinished,
  })
    .then(QueueBundleActions.removeBundle.completed.bind(that, bundle))
    .catch(QueueBundleActions.removeBundle.failed.bind(that, bundle));
});

QueueBundleActions.search.listen(function (itemInfo, location) {
  return DownloadableItemActions.search({ 
    itemInfo,
  }, location);
});

QueueBundleActions.searchBundleAlternates.listen(function (bundle) {
  let that = this;
  return SocketService.post(`${QueueConstants.BUNDLES_URL}/${bundle.id}/search`)
    .then(that.completed.bind(that, bundle))
    .catch(that.failed.bind(that, bundle));
});

QueueBundleActions.searchBundleAlternates.completed.listen(function (bundle, data) {
  NotificationActions.success({ 
    title: 'Action completed',
    message: `The bundle ${bundle.name} was searched for alternates`,
  });
});

QueueBundleActions.searchBundleAlternates.failed.listen(function (bundle, error) {
  NotificationActions.error({ 
    title: 'Action failed',
    message: `Failed to search the bundle ${bundle.name} for alternates: ${error.message}`,
  });
});

QueueBundleActions.sources.listen(function (data, location) {
  History.pushModal(location, `${location.pathname}/sources/${data.id}`, OverlayConstants.BUNDLE_SOURCE_MODAL);
});

QueueBundleActions.content.listen(function (data, location) {
  History.pushModal(location, `${location.pathname}/content/${data.id}`, OverlayConstants.BUNDLE_CONTENT_MODAL);
});

export default QueueBundleActions;
