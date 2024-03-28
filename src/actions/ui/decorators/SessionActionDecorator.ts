import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { MENU_DIVIDER } from 'constants/ActionConstants';

type SessionType = UI.SessionItemBase;

export default function (
  actions: UI.ActionListType<SessionType>,
  sessionsUrl: string,
  editAccess: API.AccessEnum,
) {
  const handleRemoveSession: UI.ActionHandler<SessionType> = ({ data: session }) => {
    return SocketService.delete(`${sessionsUrl}/${session.id}`);
  };

  const SessionActions: UI.ActionListType<SessionType> = {
    divider: MENU_DIVIDER,
    removeSession: {
      displayName: 'Close',
      access: editAccess,
      icon: IconConstants.REMOVE,
      handler: handleRemoveSession,
    },
  };

  return Object.assign(actions, SessionActions);
}
