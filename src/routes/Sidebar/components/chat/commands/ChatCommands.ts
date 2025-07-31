import { runBackgroundSocketAction } from '@/utils/ActionUtils';
import { APISocket } from '@/services/SocketService';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

type ClearHandler = (id: API.IdType, socket: APISocket) => Promise<any>;

export const buildChatCommands = (
  editAccess: API.AccessEnum,
  clearAPIAction: ClearHandler,
) => {
  const handleMe: UI.ChatCommandHandler = (
    params,
    { chatApi, chatSession },
    { socket },
  ) => {
    if (params) {
      chatApi.sendChatMessage(socket, chatSession, params, true);
    }
  };

  const handleClear: UI.ChatCommandHandler = (params, { chatSession }, { t, socket }) => {
    runBackgroundSocketAction(() => clearAPIAction(chatSession.id, socket), t);
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
