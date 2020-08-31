'use strict';

import SocketService from 'services/SocketService';
import { fetchCorsSafeData } from 'services/HttpService';

import ExtensionConstants from 'constants/ExtensionConstants';

import History from 'utils/History';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';


const isManaged = (extension: API.Extension) => extension.managed;
const isRunning = (extension: API.Extension) => extension.running;
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

const downloadExtension = (url: string, installId?: string, shasum?: string) => {
  return SocketService.post(ExtensionConstants.DOWNLOAD_URL, {
    install_id: installId ? installId : url,
    url,
    shasum
  });
};

const handleNpmAction: UI.ActionHandler<UI.NpmPackage> = async (
  { data: npmPackage, ...other }
) => {
  const data = await fetchCorsSafeData(ExtensionConstants.NPM_PACKAGE_URL + npmPackage.name + '/latest', true);

  const { tarball, shasum } = data.dist;

  return downloadExtension(tarball, npmPackage.name, shasum);
};

const handleInstallUrl: UI.ActionHandler<undefined> = (
  { data }, url: string
) => {
  return downloadExtension(url);
};

const handleRemove: UI.ActionHandler<API.Extension> = (
  { data }
) => {
  return SocketService.delete(ExtensionConstants.EXTENSIONS_URL + '/' + data.name);
};


const ExtensionInstallActions: UI.ActionListType<undefined> = {
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
    icon: IconConstants.REFRESH_COLORED,
    access: API.AccessEnum.ADMIN,
    handler: handleNpmAction,
  },
};

const ExtensionManageActions: UI.ActionListType<API.Extension> = {
  start: {
    displayName: 'Start',
    icon: IconConstants.PLAY,
    filter: ext => isManaged(ext) && !isRunning(ext),
    access: API.AccessEnum.ADMIN,
    handler: handleStart,
  },
  stop: {
    displayName: 'Stop',
    icon: IconConstants.STOP,
    filter: ext => isManaged(ext) && isRunning(ext),
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
  divider: null,
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
