import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

type SessionType = UI.SessionItemBase;

export const BuildClearChatAction = (sessionUrl: string, editAccess: API.AccessEnum) => {
  const handleClear: UI.ActionHandler<SessionType> = ({ data: session }) => {
    return SocketService.delete(`${sessionUrl}/${session.id}/messages`);
  };

  const ClearChatAction = {
    id: 'clear',
    displayName: 'Clear chat',
    access: editAccess,
    icon: IconConstants.CLEAR,
    handler: handleClear,
  };

  return ClearChatAction;

  /*const ChatActions: UI.ActionListType<SessionType> = {
    clear: ClearChatAction,
  };*/

  // return Object.assign(actions, ChatActions);
};
