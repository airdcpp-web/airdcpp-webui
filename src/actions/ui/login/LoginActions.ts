import IconConstants from '@/constants/IconConstants';
import SessionConstants from '@/constants/SessionConstants';
import SettingConstants from '@/constants/SettingConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

const handleNewUserIntroSeen: UI.ActionHandler<void> = ({ socket, appStore }) => {
  appStore.login.onNewUserIntroSeen();
  return socket.post(SettingConstants.ITEMS_SET_URL, {
    [SessionConstants.WIZARD_PENDING]: false,
  });
};

export const LoginNewUserIntroSeenAction = {
  id: 'newUserIntroSeen',
  displayName: `Close and don't show again`,
  access: API.AccessEnum.SETTINGS_EDIT,
  icon: IconConstants.SAVE_COLORED,
  handler: handleNewUserIntroSeen,
};

export const LoginActionModule = {
  moduleId: UI.Modules.COMMON,
  subId: 'login',
};
