import { showAction } from 'utils/ActionUtils';
import NotificationActions from 'actions/NotificationActions';


const handleMe = (params, { actions, session }) => {
  if (params) {
    actions.sendMessage(session, params, true);
  }
};

const handleClear = (params, { actions, session }) => {
  actions.clear(session);
};

const CommandHandler = (sessionProps) => {
  const commands = {
    clear: {
      help: 'Clear message cache',
      handler: handleClear,
      access: sessionProps.actions.clear.access,
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
    handle: (command, params) => {
      if (commands[command]) {
        commands[command].handler(params, sessionProps);
      }
    }
  };
};

export default CommandHandler;