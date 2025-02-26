import { userOnlineStatusToColor } from '@/utils/TypeConvert';
import { UserMenu } from '@/components/action-menu';
import UserIcon from '@/components/icon/UserIcon';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import MenuConstants from '@/constants/MenuConstants';

interface UserSessionBase {
  user: API.HintedUser;
}

export default function <SessionT extends UI.SessionItemBase & UserSessionBase>(
  itemMenuIds: string[],
) {
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
      return <UserIcon flags={session.user.flags} />;
    },

    itemHeaderTitleGetter(session, location, actionMenu) {
      const { user } = session;
      return (
        <UserMenu user={user} ids={itemMenuIds} remoteMenuId={MenuConstants.HINTED_USER}>
          {actionMenu}
        </UserMenu>
      );
    },
  };

  return UserItemHandlerDecorator;
}
