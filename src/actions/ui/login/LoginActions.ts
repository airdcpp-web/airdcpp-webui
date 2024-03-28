import SocketService from 'services/SocketService';

import AccessConstants from 'constants/AccessConstants';
import IconConstants from 'constants/IconConstants';
import SessionConstants from 'constants/SessionConstants';
import SettingConstants from 'constants/SettingConstants';

import * as UI from 'types/ui';
import LoginStore from 'stores/LoginStore';

const handleNewUserIntroSeen = () => {
  LoginStore.onNewUserIntroSeen();
  return SocketService.post(SettingConstants.ITEMS_SET_URL, {
    [SessionConstants.WIZARD_PENDING]: false,
  });
};

export const LoginNewUserIntroSeenAction = {
  id: 'newUserIntroSeen',
  displayName: `Close and don't show again`,
  access: AccessConstants.SETTINGS_EDIT,
  icon: IconConstants.SAVE_COLORED,
  handler: handleNewUserIntroSeen,
};

const LoginActions: UI.ActionListType<undefined> = {
  newUserIntroSeen: LoginNewUserIntroSeenAction,
};

export default {
  moduleId: UI.Modules.COMMON,
  subId: 'login',
  actions: LoginActions,
};
