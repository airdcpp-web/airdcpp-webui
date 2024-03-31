import SocketService from 'services/SocketService';
import { fetchCorsSafeData } from 'services/HttpService';

import ExtensionConstants from 'constants/ExtensionConstants';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

const downloadExtension = (url: string, installId?: string, shasum?: string) => {
  return SocketService.post(ExtensionConstants.DOWNLOAD_URL, {
    install_id: installId ? installId : url,
    url,
    shasum,
  });
};

const handleNpmAction: UI.ActionHandler<UI.NpmPackage> = async ({
  data: npmPackage,
  ...other
}) => {
  const data = await fetchCorsSafeData(
    ExtensionConstants.NPM_PACKAGE_URL + npmPackage.name + '/latest',
    true,
  );

  const { tarball, shasum } = data.dist;

  return downloadExtension(tarball, npmPackage.name, shasum);
};

const handleInstallUrl: UI.ActionHandler<undefined> = ({ data }, url: string) => {
  return downloadExtension(url);
};

export const ExtensionInstallURLAction = {
  id: 'installUrl',
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
    },
  },
  handler: handleInstallUrl,
};

export const ExtensionInstallNpmAction = {
  id: 'installNpm',
  displayName: 'Install',
  icon: IconConstants.CREATE,
  access: API.AccessEnum.ADMIN,
  handler: handleNpmAction,
};

export const ExtensionUpdateNpmAction = {
  id: 'updateNpm',
  displayName: 'Update',
  icon: IconConstants.REFRESH_COLORED,
  access: API.AccessEnum.ADMIN,
  handler: handleNpmAction,
};

export const ExtensionInstallActionModule = {
  moduleId: UI.Modules.EXTENSIONS,
};
