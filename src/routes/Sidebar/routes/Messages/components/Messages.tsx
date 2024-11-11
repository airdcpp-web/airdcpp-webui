import * as React from 'react';

import SessionLayout from 'routes/Sidebar/components/SessionLayout';
import UserItemHandlerDecorator from 'routes/Sidebar/decorators/UserItemHandlerDecorator';

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';
import PrivateChatAPIActions from 'actions/reflux/PrivateChatActions';

import MessageNew from 'routes/Sidebar/routes/Messages/components/MessageNew';
import PrivateChatSession from 'routes/Sidebar/routes/Messages/components/PrivateChatSession';

import * as API from 'types/api';
import * as UI from 'types/ui';

import {
  SessionProviderDecoratorChildProps,
  SessionProviderDecorator,
} from 'routes/Sidebar/decorators/SessionProviderDecorator';
import IconConstants from 'constants/IconConstants';

import '../style.css';
import { PrivateChatActionMenu } from 'actions/ui/private-chat';

const sessionActions = ['clearChat'];

const Messages: React.FC<SessionProviderDecoratorChildProps<API.PrivateChat>> = (
  props,
) => {
  const { params, sessionT, ...other } = props;
  return (
    <SessionLayout
      activeId={params.id}
      baseUrl="messages"
      newCaption={sessionT.t('new', 'New session')}
      newDescription={sessionT.t('newDesc', 'Open a new private chat session')}
      newIcon={IconConstants.MESSAGES_PLAIN}
      unreadInfoStore={PrivateChatSessionStore}
      editAccess={API.AccessEnum.PRIVATE_CHAT_EDIT}
      uiActions={PrivateChatActionMenu}
      sessionApi={PrivateChatAPIActions as UI.SessionActions<API.PrivateChat>}
      actionIds={sessionActions}
      sessionItemLayout={PrivateChatSession}
      newLayout={MessageNew}
      sessionT={sessionT}
      remoteMenuId="private_chat"
      {...UserItemHandlerDecorator(['browse', 'ignore', 'unignore'])}
      {...other}
    />
  );
};

export default SessionProviderDecorator(
  Messages,
  PrivateChatSessionStore,
  UI.Modules.MESSAGES,
);
