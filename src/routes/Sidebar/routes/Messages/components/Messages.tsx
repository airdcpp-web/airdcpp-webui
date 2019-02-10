import React from 'react';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';
import UserItemHandlerDecorator from 'routes/Sidebar/decorators/UserItemHandlerDecorator';

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';
import PrivateChatActions from 'actions/PrivateChatActions';

import MessageNew from 'routes/Sidebar/routes/Messages/components/MessageNew';
import PrivateChatSession from 'routes/Sidebar/routes/Messages/components/PrivateChatSession';

import * as API from 'types/api';
import * as UI from 'types/ui';

import '../style.css';
import { 
  SessionProviderDecoratorChildProps, SessionProviderDecorator
} from 'routes/Sidebar/decorators/SessionProviderDecorator';
import { toI18nKey } from 'utils/TranslationUtils';


const sessionActions = [ 'clear' ];

const Messages: React.FC<SessionProviderDecoratorChildProps<API.PrivateChat>> = props => {
  const { match, t, ...other } = props;
  return (
    <SessionLayout 
      activeId={ match.params.id }
      baseUrl="messages"
      newCaption={ t(toI18nKey('new', UI.Modules.MESSAGES), 'New session') }
      newDescription={ t(toI18nKey('newDesc', UI.Modules.MESSAGES), 'Open a new private chat session') } 
      newIcon="comments"
      unreadInfoStore={ PrivateChatSessionStore }
      editAccess={ API.AccessEnum.PRIVATE_CHAT_EDIT }
      actions={ PrivateChatActions }
      actionIds={ sessionActions }
      sessionItemLayout={ PrivateChatSession }
      newLayout={ MessageNew }

      { ...UserItemHandlerDecorator([ 'browse', 'ignore', 'unignore' ]) }
      { ...other }
    />
  );
};

export default SessionProviderDecorator(Messages, PrivateChatSessionStore);
