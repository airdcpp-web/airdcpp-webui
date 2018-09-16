'use strict';
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import ConfirmDialog from 'components/semantic/ConfirmDialog';
import InputDialog from 'components/semantic/InputDialog';

import AccessConstants from 'constants/AccessConstants';
import OverlayConstants from 'constants/OverlayConstants';
import ExtensionConstants from 'constants/ExtensionConstants';
import NotificationActions from 'actions/NotificationActions';

import History from 'utils/History';
import IconConstants from 'constants/IconConstants';


const isManaged = extension => extension.managed;
const hasSettings = extension => extension.has_settings;

const ExtensionActions = Reflux.createActions([
  { 'installNpm': { 
    displayName: 'Install',
    icon: IconConstants.CREATE,
    access: AccessConstants.ADMIN,
  } },
  { 'updateNpm': { 
    displayName: 'Update',
    icon: IconConstants.REFRESH,
    access: AccessConstants.ADMIN,
  } },
  { 'installUrl': { 
    displayName: 'Install from URL',
    children: [ 'saved' ], 
    icon: IconConstants.CREATE,
    access: AccessConstants.ADMIN,
  } },
  { 'remove': { 
    asyncResult: true, 
    children: [ 'confirmed' ], 
    displayName: 'Uninstall',
    icon: IconConstants.REMOVE,
    filter: isManaged,
    access: AccessConstants.ADMIN,
  } },
  { 'start': { 
    asyncResult: true, 
    displayName: 'Start',
    icon: IconConstants.PLAY,
    filter: isManaged,
    access: AccessConstants.ADMIN,
  } },
  { 'stop': { 
    asyncResult: true, 
    displayName: 'Stop',
    icon: IconConstants.STOP,
    filter: isManaged,
    access: AccessConstants.ADMIN,
  } },
  { 'configure': { 
    children: [ 'saved' ],
    displayName: 'Configure',
    icon: IconConstants.EDIT,
    filter: hasSettings,
    access: AccessConstants.SETTINGS_EDIT,
  } },
]);

ExtensionActions.configure.listen(function (extension, location) {
  History.pushModal(location, `${location.pathname}/extensions/${extension.id}`, OverlayConstants.EXTENSION_CONFIGURE_MODAL);
});

ExtensionActions.start.listen(function (extension) {
  const that = this;
  return SocketService.post(`${ExtensionConstants.EXTENSIONS_URL}/${extension.name}/start`)
    .then(ExtensionActions.start.completed.bind(that, extension))
    .catch(ExtensionActions.start.failed.bind(that, extension));
});

ExtensionActions.stop.listen(function (extension) {
  const that = this;
  return SocketService.post(`${ExtensionConstants.EXTENSIONS_URL}/${extension.name}/stop`)
    .then(ExtensionActions.stop.completed.bind(that, extension))
    .catch(ExtensionActions.stop.failed.bind(that, extension));
});

ExtensionActions.start.failed.listen(function (extension, error) {
  NotificationActions.info({ 
    title: 'Failed to start the extension ' + extension.name,
    message: error.message,
  });
});

ExtensionActions.stop.failed.listen(function (extension, error) {
  NotificationActions.info({ 
    title: 'Failed to stop the extension ' + extension.name,
    message: error.message,
  });
});

ExtensionActions.installNpm.listen(function (npmPackage, location) {
  $.getJSON(ExtensionConstants.NPM_PACKAGE_URL + npmPackage.name + '/latest', data => {
    const { tarball, shasum } = data.dist;
    ExtensionActions.installUrl.saved(tarball, npmPackage.name, shasum);
  })
    .fail(ExtensionActions.installNpm.failed);
});

ExtensionActions.updateNpm.listen(function (npmPackage, location) {
  $.getJSON(ExtensionConstants.NPM_PACKAGE_URL + npmPackage.name + '/latest', data => {
    const { tarball, shasum } = data.dist;
    ExtensionActions.installUrl.saved(tarball, shasum);
  })
    .fail(ExtensionActions.installNpm.failed);
});

ExtensionActions.installUrl.listen(function () {
  const options = {
    icon: this.icon,
    approveCaption: 'Install',
    title: 'Install extension from URL',
    text: 'Enter download URL',
  };

  const inputOptions = {
    placeholder: 'Enter URL',
  };

  InputDialog(options, inputOptions, this.saved.bind(this));
});

ExtensionActions.installUrl.saved.listen(function (url, installId, shasum) {
  return SocketService.post(ExtensionConstants.DOWNLOAD_URL, {
    install_id: installId ? installId : url,
    url,
    shasum
  })
    .then(ExtensionActions.installUrl.completed)
    .catch(ExtensionActions.installUrl.failed);
});

ExtensionActions.remove.listen(function (extension) {
  const options = {
    title: this.displayName,
    content: 'Are you sure that you want to remove the extension ' + extension.name + '? This will also remove possible extension-specific settings.',
    icon: this.icon,
    approveCaption: 'Remove extension',
    rejectCaption: "Don't remove",
  };

  ConfirmDialog(options, this.confirmed.bind(this, extension));
});

ExtensionActions.remove.confirmed.listen(function (extension) {
  const that = this;
  return SocketService.delete(ExtensionConstants.EXTENSIONS_URL + '/' + extension.name)
    .then(ExtensionActions.remove.completed.bind(that, extension))
    .catch(ExtensionActions.remove.failed.bind(that, extension));
});

ExtensionActions.remove.failed.listen(function (extension, error) {
  NotificationActions.info({ 
    title: 'Failed to remove the extension ' + extension.name,
    message: error.message,
  });
});

export default ExtensionActions;
