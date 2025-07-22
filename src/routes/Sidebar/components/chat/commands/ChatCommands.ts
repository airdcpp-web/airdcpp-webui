import { runBackgroundSocketAction } from '@/utils/ActionUtils';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { APISocket } from '@/services/SocketService';

type ClearHandler = (id: API.IdType, socket: APISocket) => Promise<any>;

export const buildChatCommands = (
  editAccess: API.AccessEnum,
  clearAPIAction: ClearHandler,
) => {
  const handleMe: UI.ChatCommandHandler = (params, { chatApi, session }, { socket }) => {
    if (params) {
      chatApi.sendChatMessage(socket, session, params, true);
    }
  };

  const handleClear: UI.ChatCommandHandler = (params, { session }, { t, socket }) => {
    runBackgroundSocketAction(() => clearAPIAction(session.id, socket), t);
  };

  const commands: UI.ChatCommandList = {
    clear: {
      help: 'Clear message cache',
      handler: handleClear,
      access: editAccess,
    },
    me: {
      help: 'Send message in third person',
      handler: handleMe,
    },
  };

  return commands;
};
