'use strict';

import SocketService from 'services/SocketService';

import ExtensionConstants from 'constants/ExtensionConstants';

import History from 'utils/History';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { toCorsSafeUrl /*, toApiError*/ } from 'utils/HttpUtils';


const isManaged = (extension: API.Extension) => extension.managed;
const hasSettings = (extension: API.Extension) => extension.has_settings;


const handleConfigure: UI.ActionHandler<API.Extension> = ({ data: extension, location }) => {
  History.push(`${location.pathname}/extensions/${extension.id}`);
};

const handleStart: UI.ActionHandler<API.Extension> = ({ data: extension }) => {
  return SocketService.post(`${ExtensionConstants.EXTENSIONS_URL}/${extension.name}/start`);
};

const handleStop: UI.ActionHandler<API.Extension> = ({ data: extension }) => {
  return SocketService.post(`${ExtensionConstants.EXTENSIONS_URL}/${extension.name}/stop`);
};

/*ExtensionActions.start.failed.listen(function (extension: API.Extension, error: ErrorResponse) {
  NotificationActions.info({ 
    title: 'Failed to start the extension ' + extension.name,
    message: error.message,
  });
});

ExtensionActions.stop.failed.listen(function (extension: API.Extension, error: ErrorResponse) {
  NotificationActions.info({ 
    title: 'Failed to stop the extension ' + extension.name,
    message: error.message,
  });
});*/


interface InstallData {
  url: string;
  shasum: string;
  installId?: string;
}

const handleInstallNpm: UI.ActionHandler<UI.NpmPackage> = ({ data: npmPackage, location }) => {
  $.getJSON(toCorsSafeUrl(ExtensionConstants.NPM_PACKAGE_URL + npmPackage.name + '/latest'), responseData => {
    const { tarball, shasum } = responseData.dist;
    handleInstallUrl({
      location, 
      data: {
        url: tarball, 
        installId: npmPackage.name, 
        shasum
      }
    });
  });
  //  .catch(ExtensionActions.installNpm.failed);
};

/*ExtensionActions.installNpm.failed.listen(function (error: JQuery.jqXHR) {
  NotificationActions.apiError('Installation failed', toApiError(error, i18n.t));
});*/

const handleInstallUrl: UI.ActionHandler<InstallData> = (
  { data }
) => {
  const { installId, url, shasum } = data;
  return SocketService.post(ExtensionConstants.DOWNLOAD_URL, {
    install_id: installId ? installId : url,
    url,
    shasum
  });
};


/*ExtensionActions.installUrl.failed.listen(function (error: ErrorResponse) {
  NotificationActions.apiError('Extension installation failed', error);
});*/

const handleUpdateNpm: UI.ActionHandler<UI.NpmPackage> = ({ data: npmPackage, location }) => {
  $.getJSON(toCorsSafeUrl(ExtensionConstants.NPM_PACKAGE_URL + npmPackage.name + '/latest'), data => {
    const { tarball, shasum } = data.dist;
    handleInstallUrl({
      location, 
      data: {
        url: tarball, 
        shasum
      }
    });
  });
};

/*ExtensionActions.updateNpm.failed.listen(function (error: JQuery.jqXHR) {
  NotificationActions.apiError('Updating failed', toApiError(error, i18n.t));
});*/

const handleRemove: UI.ActionHandler<API.Extension> = (
  { data }
) => {
  return SocketService.delete(ExtensionConstants.EXTENSIONS_URL + '/' + data.name);
};

/*ExtensionActions.remove.failed.listen(function (extension: API.Extension, error: ErrorResponse) {
  NotificationActions.info({ 
    title: 'Failed to remove the extension ' + extension.name,
    message: error.message,
  });
});*/



const ExtensionInstallActions: UI.ActionListType<InstallData> = {
  installUrl: {
    displayName: 'Install from URL',
    icon: IconConstants.CREATE,
    access: API.AccessEnum.ADMIN,
    input: {
      approveCaption: 'Install',
      content: 'Enter download URL',
      inputProps: {
        placeholder: 'Enter URL',
        type: 'url',
        required: true,
      }
    },
    handler: handleInstallUrl
  },
};


const ExtensionNpmActions: UI.ActionListType<UI.NpmPackage> = {
  installNpm: {
    displayName: 'Install',
    icon: IconConstants.CREATE,
    access: API.AccessEnum.ADMIN,
    handler: handleInstallNpm,
  },
  updateNpm: {
    displayName: 'Update',
    icon: IconConstants.REFRESH,
    access: API.AccessEnum.ADMIN,
    handler: handleUpdateNpm,
  },
};

const ExtensionManageActions: UI.ActionListType<API.Extension> = {
  remove: {
    displayName: 'Uninstall',
    icon: IconConstants.REMOVE,
    filter: isManaged,
    access: API.AccessEnum.ADMIN,
    confirmation: {
      // tslint:disable-next-line:max-line-length
      content: 'Are you sure that you want to remove the extension {{item.name}}? This will also remove possible extension-specific settings.',
      approveCaption: 'Remove extension',
      rejectCaption: `Don't remove`,
    },
    handler: handleRemove,
  },
  start: {
    displayName: 'Start',
    icon: IconConstants.PLAY,
    filter: isManaged,
    access: API.AccessEnum.ADMIN,
    handler: handleStart,
  },
  stop: {
    displayName: 'Stop',
    icon: IconConstants.STOP,
    filter: isManaged,
    access: API.AccessEnum.ADMIN,
    handler: handleStop,
  },
  configure: {
    displayName: 'Configure',
    icon: IconConstants.EDIT,
    filter: hasSettings,
    access: API.AccessEnum.SETTINGS_EDIT,
    handler: handleConfigure,
  },
};


export default {
  install: {
    moduleId: UI.Modules.EXTENSIONS,
    actions: ExtensionInstallActions,
  },
  npm: {
    moduleId: UI.Modules.EXTENSIONS,
    actions: ExtensionNpmActions,
  },
  manage: {
    moduleId: UI.Modules.EXTENSIONS,
    actions: ExtensionManageActions,
  }
};
