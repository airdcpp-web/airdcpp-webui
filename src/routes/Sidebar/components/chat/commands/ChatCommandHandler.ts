import { actionAccess } from 'utils/ActionUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';

const getHelpString = (
  commands: UI.ChatCommandList,
  session: UI.AuthenticatedSession,
) => {
  const commandHelp = Object.keys(commands)
    .filter((command) => actionAccess(commands[command], session))
    .map((command) => `\t/${command} - ${commands[command].help}`)
    .join('\n');

  return `
\tChat commands

${commandHelp}
`;
};

const CommandHandler = (chatController: UI.ChatController) => {
  const { chatCommands } = chatController;
  return {
    handle: (
      command: string,
      params: UI.ChatCommandParam,
      commandProps: UI.ChatCommandProps,
    ) => {
      if (chatCommands[command]) {
        chatCommands[command].handler(params, chatController, commandProps);
      } else if (command === 'help') {
        const { session, chatApi } = chatController;
        const text = getHelpString(chatCommands, commandProps.session);
        const message: API.OutgoingChatStatusMessage = {
          text,
          severity: API.SeverityEnum.INFO,
          type: API.StatusMessageTypeEnum.PRIVATE,
          owner: `session:${commandProps.session.sessionId}`,
        };

        chatApi.sendStatusMessage(commandProps.socket, session, message);
      }
    },
  };
};

export default CommandHandler;
