import { Component } from 'react';

import ChatLayout, {
  ChatAPI,
  ChatActionList,
} from 'routes/Sidebar/components/chat/ChatLayout';
import MessageFooter from 'routes/Sidebar/routes/Messages/components/MessageFooter';

import PrivateChatMessageStore from 'stores/PrivateChatMessageStore';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { SessionChildProps } from 'routes/Sidebar/components/SessionLayout';
import { shareTempFile } from 'services/api/ShareApi';
import PrivateChatActions from 'actions/reflux/PrivateChatActions';
import MenuConstants from 'constants/MenuConstants';

type PrivateChatSessionProps = SessionChildProps<
  API.PrivateChat,
  UI.EmptyObject,
  ChatActionList
>;

class PrivateChatSession extends Component<PrivateChatSessionProps> {
  static displayName = 'PrivateChatSession';

  handleFileUpload = (file: File) => {
    const { cid, hub_url, flags } = this.props.session.user;

    const isPrivate = !flags.includes('nmdc') && !flags.includes('bot');
    return shareTempFile(file, hub_url, isPrivate ? cid : undefined);
  };

  render() {
    const { session, sessionApi, sessionT, uiActions } = this.props;
    return (
      <div className="private chat session">
        <ChatLayout
          chatAccess={API.AccessEnum.PRIVATE_CHAT_SEND}
          chatActions={uiActions}
          chatApi={PrivateChatActions as ChatAPI}
          sessionApi={sessionApi}
          messageStore={PrivateChatMessageStore}
          session={session}
          handleFileUpload={this.handleFileUpload}
          highlightRemoteMenuId={MenuConstants.PRIVATE_CHAT_MESSAGE_HIGHLIGHT}
        />

        <MessageFooter session={session} sessionT={sessionT} />
      </div>
    );
  }
}

export default PrivateChatSession;
