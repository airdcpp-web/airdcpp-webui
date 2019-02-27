'use strict';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';


type SessionType = UI.SessionItemBase;

export default function (
  actions: UI.ActionListType<SessionType>, 
  sessionUrl: string, 
  editAccess: API.AccessEnum
) {
  const handleClear: UI.ActionHandler<SessionType> = (
    { data: session }
  ) => {
    return SocketService.delete(`${sessionUrl}/${session.id}/messages`);
  };

  /*ChatActions.clear.failed.listen(function (
    this: UI.AsyncActionType<SessionType>, 
    session: SessionType, 
    error: ErrorResponse
  ) {
    NotificationActions.apiError('Failed to clear chat messages', error, session.id);
  });*/


  const ChatActions: UI.ActionListType<SessionType> = {
    clear: {
      displayName: 'Clear chat',
      access: editAccess,
      icon: IconConstants.CLEAR,
      handler: handleClear,
    }
  };

  return Object.assign(actions, ChatActions);
}