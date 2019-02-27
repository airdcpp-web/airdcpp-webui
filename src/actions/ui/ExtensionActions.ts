'use strict';

import SocketService from 'services/SocketService';

import ExtensionConstants from 'constants/ExtensionConstants';

import History from 'utils/History';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { toCorsSafeUrl, toApiError } from 'utils/HttpUtils';
import { i18n } from 'services/LocalizationService';


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

interface InstallData {
  url: string;
  shasum: string;
  installId?: string;
}

const handleNpmAction: UI.ActionHandler<UI.NpmPackage> = (
  { data: npmPackage, ...other }
): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.getJSON(toCorsSafeUrl(ExtensionConstants.NPM_PACKAGE_URL + npmPackage.name + '/latest'), async (responseData) => {
      const { tarball, shasum } = responseData.dist;

      try {
        const ret = await handleInstallUrl({
          data: {
            url: tarball, 
            installId: npmPackage.name, 
            shasum
          },
          ...other
        });

        resolve(ret);
      } catch (e) {
        reject(e);
      }
    })
      .catch(error => {
        reject(toApiError(error, i18n.t));
      });
  });
};

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


/*const handleInstallNpm: UI.ActionHandler<UI.NpmPackage> = ({ data: npmPackage, location, t }) => {
  return handleNpmAction(npmPackage, location);
};

const handleUpdateNpm: UI.ActionHandler<UI.NpmPackage> = ({ data: npmPackage, location }) => {
  return handleNpmAction(npmPackage, location);
};*/

const handleRemove: UI.ActionHandler<API.Extension> = (
  { data }
) => {
  return SocketService.delete(ExtensionConstants.EXTENSIONS_URL + '/' + data.name);
};


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
    handler: handleNpmAction,
  },
  updateNpm: {
    displayName: 'Update',
    icon: IconConstants.REFRESH,
    access: API.AccessEnum.ADMIN,
    handler: handleNpmAction,
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
