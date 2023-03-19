import { actionAccess, runBackgroundSocketAction } from 'utils/ActionUtils';
import { MessageComposerProps } from './MessageComposer';
import { Location } from 'history';

//import * as UI from 'types/ui';
import * as API from 'types/api';

type ParamsType = string | undefined;
type ChatCommandHandler = (
  params: ParamsType,
  props: MessageComposerProps,
  location: Location
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
  location
) => {
  runBackgroundSocketAction(
    () =>
      chatActions.actions.clear.handler({
        data: session,
        location,
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
    handle: (command: string, params: ParamsType, location: Location) => {
      if (commands[command]) {
        commands[command].handler(params, sessionProps, location);
      } else if (command === 'help') {
        const { session, chatApi } = sessionProps;
        const text = getHelpString(commands);
        chatApi.sendStatusMessage(session, text, API.SeverityEnum.INFO);
      }
    },
  };
};

export default CommandHandler;
