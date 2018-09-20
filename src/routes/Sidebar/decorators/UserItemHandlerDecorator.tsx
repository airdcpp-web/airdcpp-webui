import React from 'react';

import { userOnlineStatusToColor } from 'utils/TypeConvert';
import { UserMenu } from 'components/menu/DropdownMenu';
import UserIcon from 'components/icon/UserIcon';

import * as API from 'types/api';
import * as UI from 'types/ui';


interface UserSessionBase {
  user: API.HintedUser;
}

export default function <SessionT extends UserSessionBase>(itemMenuIds: string[]) {
  const UserItemHandlerDecorator: UI.SessionInfoGetter<SessionT> = {
    itemNameGetter(session) {
      return session.user.nicks;
    },

    itemStatusGetter(session) {
      const { flags } = session.user;
      return userOnlineStatusToColor(flags);
    },

    itemHeaderDescriptionGetter(session) {
      return session.user.hub_names;
    },

    itemHeaderIconGetter(session) {
      return <UserIcon flags={ session.user.flags } />;
    },

    itemHeaderTitleGetter(session, location, actionMenu) {
      const { user } = session;
      return (
        <UserMenu 
          user={ user } 
          ids={ itemMenuIds }
        >
          { actionMenu }
        </UserMenu>
      );
    },
  };

  return UserItemHandlerDecorator;
}
