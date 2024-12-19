import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

type SessionType = UI.SessionItemBase;

export const BuildClearChatAction = (sessionUrl: string, editAccess: API.AccessEnum) => {
  const handleClear: UI.ActionHandler<SessionType> = ({ itemData: session, socket }) => {
    return socket.delete(`${sessionUrl}/${session.id}/messages`);
  };

  const ClearChatAction = {
    id: 'clear',
    displayName: 'Clear chat',
    access: editAccess,
    icon: IconConstants.CLEAR,
    handler: handleClear,
  };

  return ClearChatAction;
};
