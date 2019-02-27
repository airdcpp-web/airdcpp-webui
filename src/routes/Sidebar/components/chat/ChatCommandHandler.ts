import { showAction } from 'utils/ActionUtils';
import NotificationActions from 'actions/NotificationActions';
import { MessageComposerProps } from './MessageComposer';
//import { ChatSessionProps } from 'routes/Sidebar/components/chat/ChatLayout';


type ParamsType = string | undefined;

const handleMe = (params: ParamsType, { chatApi, session }: MessageComposerProps) => {
  if (params) {
    chatApi.sendMessage(session, params, true);
  }
};

const handleClear = (params: ParamsType, { chatApi, session }: MessageComposerProps) => {
  chatApi.clear(session);
};

const CommandHandler = (sessionProps: MessageComposerProps) => {
  const commands = {
    clear: {
      help: 'Clear message cache',
      handler: handleClear,
      access: sessionProps.chatActions.clear.access,
    },
    help: {
      handler: () => {
        // TODO: send as chat status message
        NotificationActions.info({
          title: 'Available commands',
          message: Object.keys(commands)
            .filter(command => showAction(commands[command]))
            .join(', '),
        });
      }
    },
    me: {
      help: 'Send message in third person',
      handler: handleMe,
    },
  };

  return {
    handle: (command: string, params: ParamsType) => {
      if (commands[command]) {
        commands[command].handler(params, sessionProps);
      }
    }
  };
};

export default CommandHandler;