'use strict';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';


type SessionType = UI.SessionItemBase;

export default function (
  actions: UI.ActionListType<SessionType>, 
  sessionsUrl: string, 
  editAccess: API.AccessEnum
) {
  const handleRemoveSession: UI.ActionHandler<SessionType> = (
    { data: session }
  ) => {
    SocketService.delete(`${sessionsUrl}/${session.id}`);
  };

  /*SessionActions.removeSession.failed.listen(function (session: SessionType, error: ErrorResponse) {
    NotificationActions.apiError('Failed to remove session ' + session.id, error);
  });*/  
  
  const SessionActions: UI.ActionListType<SessionType> = {
    removeSession: { 
      displayName: 'Close',
      access: editAccess,
      icon: IconConstants.REMOVE,
      handler: handleRemoveSession,
    }
  };

  return Object.assign(actions, SessionActions);
}