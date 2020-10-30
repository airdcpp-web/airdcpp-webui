'use strict';
import { Component } from 'react';

import HubMessageStore from 'stores/HubMessageStore';

import { loadSessionProperty, saveSessionProperty } from 'utils/BrowserUtils';
import Checkbox from 'components/semantic/Checkbox';

import ChatLayout, { ChatAPI, ChatActionList } from 'routes/Sidebar/components/chat/ChatLayout';
import HubUserTable from 'routes/Sidebar/routes/Hubs/components/HubUserTable';

import HubFooter from 'routes/Sidebar/routes/Hubs/components/HubFooter';
import { RedirectPrompt, PasswordPrompt, HubActionPrompt } from 'routes/Sidebar/routes/Hubs/components/HubPrompt';

import '../style.css';

import * as API from 'types/api';
import { SessionChildProps } from 'routes/Sidebar/components/SessionLayout';
import { shareTempFile } from 'services/api/ShareApi';
import HubActions from 'actions/reflux/HubActions';
import IconConstants from 'constants/IconConstants';
import MenuConstants from 'constants/MenuConstants';


const getStorageKey = (props: HubSessionProps) => {
  return `view_userlist_${props.session.id}`;
};

const checkList = (props: HubSessionProps) => {
  return loadSessionProperty(getStorageKey(props), false);
};

interface HubSessionProps extends SessionChildProps<API.Hub, {}, ChatActionList> {

}

class HubSession extends Component<HubSessionProps> {
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
          icon={ IconConstants.LOCK }
          content={ <PasswordPrompt hub={ session } sessionT={ sessionT }/> }
        />
      );
    }

    if (connectState === API.HubConnectStateEnum.REDIRECT) {
      return (
        <HubActionPrompt 
          title={ sessionT.translate('Redirect requested') }
          icon={ IconConstants.REDIRECT }
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

  handleFileUpload = (file: File) => {
    const { hub_url } = this.props.session;
    return shareTempFile(file, hub_url, undefined);
  }

  render() {
    const { session, sessionApi, sessionT, uiActions } = this.props;
    const { showList } = this.state;

    const checkbox = (
      <Checkbox
        className="userlist-button"
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
            chatActions={ uiActions }
            chatAccess={ API.AccessEnum.HUBS_SEND }
            session={ session }
            handleFileUpload={ this.handleFileUpload }
            highlightRemoteMenuId={ MenuConstants.HUB_MESSAGE_HIGHLIGHT }
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