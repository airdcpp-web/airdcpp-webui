import SocketService from 'services/SocketService';

import ExtensionConstants from 'constants/ExtensionConstants';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { MENU_DIVIDER } from 'constants/ActionConstants';

const isManaged = (extension: API.Extension) => extension.managed;
const isRunning = (extension: API.Extension) => extension.running;
const hasSettings = (extension: API.Extension) => extension.has_settings;

const handleConfigure: UI.ActionHandler<API.Extension> = ({
  data: extension,
  navigate,
}) => {
  navigate(`extensions/${extension.id}`);
};

const handleStart: UI.ActionHandler<API.Extension> = ({ data: extension }) => {
  return SocketService.post(
    `${ExtensionConstants.EXTENSIONS_URL}/${extension.name}/start`,
  );
};

const handleStop: UI.ActionHandler<API.Extension> = ({ data: extension }) => {
  return SocketService.post(
    `${ExtensionConstants.EXTENSIONS_URL}/${extension.name}/stop`,
  );
};

const handleRemove: UI.ActionHandler<API.Extension> = ({ data }) => {
  return SocketService.delete(ExtensionConstants.EXTENSIONS_URL + '/' + data.name);
};

export const ExtensionStartAction = {
  id: 'start',
  displayName: 'Start',
  icon: IconConstants.PLAY,
  filter: (ext: API.Extension) => isManaged(ext) && !isRunning(ext),
  access: API.AccessEnum.ADMIN,
  handler: handleStart,
};

export const ExtensionStopAction = {
  id: 'stop',
  displayName: 'Stop',
  icon: IconConstants.STOP,
  filter: (ext: API.Extension) => isManaged(ext) && isRunning(ext),
  access: API.AccessEnum.ADMIN,
  handler: handleStop,
};

export const ExtensionConfigureAction = {
  id: 'configure',
  displayName: 'Configure',
  icon: IconConstants.EDIT,
  filter: hasSettings,
  access: API.AccessEnum.SETTINGS_EDIT,
  handler: handleConfigure,
};

export const ExtensionRemoveAction = {
  id: 'remove',
  displayName: 'Uninstall',
  icon: IconConstants.REMOVE,
  filter: isManaged,
  access: API.AccessEnum.ADMIN,
  confirmation: {
    content:
      // eslint-disable-next-line max-len
      'Are you sure that you want to remove the extension {{item.name}}? This will also remove possible extension-specific settings.',
    approveCaption: 'Remove extension',
    rejectCaption: `Don't remove`,
  },
  handler: handleRemove,
};

const ExtensionManageActions: UI.ActionListType<API.Extension> = {
  start: ExtensionStartAction,
  stop: ExtensionStopAction,
  configure: ExtensionConfigureAction,
  divider: MENU_DIVIDER,
  remove: ExtensionRemoveAction,
};

export const ExtensionManageActionModule = {
  moduleId: UI.Modules.EXTENSIONS,
};

export default {
  moduleData: ExtensionManageActionModule,
  actions: ExtensionManageActions,
};
