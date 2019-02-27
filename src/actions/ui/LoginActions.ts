'use strict';
import SocketService from 'services/SocketService';

import AccessConstants from 'constants/AccessConstants';
import IconConstants from 'constants/IconConstants';
import LoginConstants from 'constants/LoginConstants';
import SettingConstants from 'constants/SettingConstants';

import * as UI from 'types/ui';



const handleNewUserIntroSeen = () => {
  return SocketService.post(SettingConstants.ITEMS_SET_URL, { [LoginConstants.WIZARD_PENDING]: false });
};

const LoginActions: UI.ActionListType<undefined> = {
  newUserIntroSeen: {
    displayName: `Close and don't show again`,
    access: AccessConstants.SETTINGS_EDIT,
    icon: IconConstants.SAVE,
    handler: handleNewUserIntroSeen,
  },
};

export default {
  moduleId: UI.Modules.COMMON,
  subId: 'login',
  actions: LoginActions,
};
