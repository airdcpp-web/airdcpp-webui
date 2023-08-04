import { actionAccess, runBackgroundSocketAction } from 'utils/ActionUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';

import LoginStore from 'stores/LoginStore';
import { NavigateFunction, Location } from 'react-router-dom';

interface CommandProps {
  location: Location;
  navigate: NavigateFunction;
  t: UI.TranslateF;
}

type ParamsType = string | undefined;
type ChatCommandHandler = (
  params: ParamsType,
  chatController: UI.ChatController,
  props: CommandProps,
) => void;

interface ChatCommand {
  help: string;
  handler: ChatCommandHandler;
  access?: string;
}

type ChatCommandList = { [key in string]: ChatCommand };

const handleMe: ChatCommandHandler = (params, { chatApi, session }) => {
  if (params) {
    chatApi.sendChatMessage(session, params, true);
  }
};

const handleClear: ChatCommandHandler = (
  params,
  { chatActions, session },
  { t, location, navigate },
) => {
  runBackgroundSocketAction(
    () =>
      chatActions.actions.clear.handler({
        data: session,
        location,
        navigate,
        t,
      }) as Promise<any>,
    t,
  );
};

const getHelpString = (commands: ChatCommandList) => {
  const commandHelp = Object.keys(commands)
    .filter((command) => actionAccess(commands[command]))
    .map((command) => `\t/${command} - ${commands[command].help}`)
    .join('\n');

  return `
\tChat commands

${commandHelp}
`;
};

const CommandHandler = (chatController: UI.ChatController) => {
  const commands: ChatCommandList = {
    clear: {
      help: 'Clear message cache',
      handler: handleClear,
      access: chatController.chatActions.actions.clear.access,
    },
    me: {
      help: 'Send message in third person',
      handler: handleMe,
    },
  };

  return {
    handle: (command: string, params: ParamsType, commandProps: CommandProps) => {
      if (commands[command]) {
        commands[command].handler(params, chatController, commandProps);
      } else if (command === 'help') {
        const { session, chatApi } = chatController;
        const text = getHelpString(commands);
        const message: API.OutgoingChatStatusMessage = {
          text,
          severity: API.SeverityEnum.INFO,
          type: API.StatusMessageTypeEnum.PRIVATE,
          owner: `session:${LoginStore.sessionId}`,
        };

        chatApi.sendStatusMessage(session, message);
      }
    },
  };
};

export default CommandHandler;
