'use strict';
import React from 'react';

import HubMessageStore from 'stores/HubMessageStore';

import { loadSessionProperty, saveSessionProperty } from 'utils/BrowserUtils';
import Checkbox from 'components/semantic/Checkbox';

import ChatLayout, { ChatActions } from 'routes/Sidebar/components/chat/ChatLayout';
import HubUserTable from 'routes/Sidebar/routes/Hubs/components/HubUserTable';

import HubFooter from 'routes/Sidebar/routes/Hubs/components/HubFooter';
import { RedirectPrompt, PasswordPrompt, HubActionPrompt } from 'routes/Sidebar/routes/Hubs/components/HubPrompt';

import '../style.css';

import * as API from 'types/api';
import { SessionChildProps } from 'routes/Sidebar/components/SessionLayout';


const getStorageKey = (props: HubSessionProps) => {
  return 'view_userlist_' + props.session.id;
};

const checkList = (props: HubSessionProps) => {
  return loadSessionProperty(getStorageKey(props), false);
};


interface HubSessionProps extends SessionChildProps<API.Hub, ChatActions> {
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
    const { session } = this.props;
    const connectState = session.connect_state.id;

    if (connectState === API.HubConnectStateEnum.PASSWORD) {
      return (
        <HubActionPrompt 
          title="Password required"
          icon="lock"
          content={ <PasswordPrompt hub={ session }/> }
        />
      );
    }

    if (connectState === API.HubConnectStateEnum.REDIRECT) {
      return (
        <HubActionPrompt 
          title="Redirect requested"
          icon="forward mail"
          content={ <RedirectPrompt hub={ session }/> }
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
    const { session, actions } = this.props;
    const { showList } = this.state;

    const checkbox = (
      <Checkbox
        type="toggle"
        caption="User list"
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
          />
        ) : (
          <ChatLayout
            messageStore={ HubMessageStore }
            actions={ actions }
            chatAccess={ API.AccessEnum.HUBS_SEND }
            session={ session }
            //location={ location }
          />
        ) }
        <HubFooter
          userlistToggle={ checkbox }
          session={ session }
        />
      </div>
    );
  }
}

export default HubSession;