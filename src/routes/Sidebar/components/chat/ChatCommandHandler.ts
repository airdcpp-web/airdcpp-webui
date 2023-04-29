import { actionAccess, runBackgroundSocketAction } from 'utils/ActionUtils';
import { MessageComposerProps } from './MessageComposer';
import { Location, History } from 'history';

import * as API from 'types/api';
import LoginStore from 'stores/LoginStore';

interface RouteProps {
  location: Location;
  history: History;
}

type ParamsType = string | undefined;
type ChatCommandHandler = (
  params: ParamsType,
  chatHandler: MessageComposerProps,
  routeProps: RouteProps
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
  { chatActions, session, t },
  { location, history }
) => {
  runBackgroundSocketAction(
    () =>
      chatActions.actions.clear.handler({
        data: session,
        location,
        history,
        t,
      }) as Promise<any>,
    t
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

const CommandHandler = (sessionProps: MessageComposerProps) => {
  const commands: ChatCommandList = {
    clear: {
      help: 'Clear message cache',
      handler: handleClear,
      access: sessionProps.chatActions.actions.clear.access,
    },
    me: {
      help: 'Send message in third person',
      handler: handleMe,
    },
  };

  return {
    handle: (command: string, params: ParamsType, routeProps: RouteProps) => {
      if (commands[command]) {
        commands[command].handler(params, sessionProps, routeProps);
      } else if (command === 'help') {
        const { session, chatApi } = sessionProps;
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
