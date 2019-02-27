'use strict';
import React from 'react';

import HubMessageStore from 'stores/HubMessageStore';

import { loadSessionProperty, saveSessionProperty } from 'utils/BrowserUtils';
import Checkbox from 'components/semantic/Checkbox';

import ChatLayout, { ChatActions, ChatLayoutProps, ChatAPI } from 'routes/Sidebar/components/chat/ChatLayout';
import HubUserTable from 'routes/Sidebar/routes/Hubs/components/HubUserTable';

import HubFooter from 'routes/Sidebar/routes/Hubs/components/HubFooter';
import { RedirectPrompt, PasswordPrompt, HubActionPrompt } from 'routes/Sidebar/routes/Hubs/components/HubPrompt';

import '../style.css';

import * as API from 'types/api';
import { SessionChildProps } from 'routes/Sidebar/components/SessionLayout';
import HubActions from 'actions/reflux/HubActions';


const getStorageKey = (props: HubSessionProps) => {
  return `view_userlist_${props.session.id}`;
};

const checkList = (props: HubSessionProps) => {
  return loadSessionProperty(getStorageKey(props), false);
};


interface HubSessionProps extends SessionChildProps<API.Hub, ChatActions>, 
  Pick<ChatLayoutProps, 'chatApi' | 'chatActions'> {
  //session: API.Hub;
  //actions: UI.SessionActions<API.Hub, ChatActions>;
}

class HubSession extends React.Component<HubSessionProps> {
  static displayName = 'HubSession';

  state = {
    showList: checkList(this.props),
  };
  
  componentDidUpdate(prevProps: HubSessionProps) {
    if (prevProps.session.id !== this.props.session.id && this.state.showList !== checkList(this.props)) {
      this.toggleListState();
    }
  }

  toggleListState = () => {
    this.setState({ showList: !this.state.showList });
  }

  getMessage = () => {
    const { session, sessionT } = this.props;
    const connectState = session.connect_state.id;

    if (connectState === API.HubConnectStateEnum.PASSWORD) {
      return (
        <HubActionPrompt 
          title={ sessionT.translate('Password required') }
          icon="lock"
          content={ <PasswordPrompt hub={ session } sessionT={ sessionT }/> }
        />
      );
    }

    if (connectState === API.HubConnectStateEnum.REDIRECT) {
      return (
        <HubActionPrompt 
          title={ sessionT.translate('Redirect requested') }
          icon="forward mail"
          content={ <RedirectPrompt hub={ session } sessionT={ sessionT }/> }
        />
      );
    }

    return null;
  }

  onClickUsers = () => {
    this.toggleListState();

    saveSessionProperty(getStorageKey(this.props), this.state.showList);
  }

  render() {
    const { session, chatActions, sessionApi, sessionT } = this.props;
    const { showList } = this.state;

    const checkbox = (
      <Checkbox
        type="toggle"
        caption={ sessionT.translate('User list') }
        onChange={ this.onClickUsers }
        checked={ showList }
      />
    );

    return (
      <div className="hub chat session">
        { this.getMessage() }
        { showList ? (
          <HubUserTable
            session={ session }
            sessionT={ sessionT }
          />
        ) : (
          <ChatLayout
            messageStore={ HubMessageStore }
            chatApi={ HubActions as ChatAPI }
            sessionApi={ sessionApi }
            chatActions={ chatActions }
            chatAccess={ API.AccessEnum.HUBS_SEND }
            session={ session }
          />
        ) }
        <HubFooter
          userlistToggle={ checkbox }
          session={ session }
          sessionT={ sessionT }
        />
      </div>
    );
  }
}

export default HubSession;