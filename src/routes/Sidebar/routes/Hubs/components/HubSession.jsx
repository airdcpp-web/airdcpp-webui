'use strict';
import React from 'react';

import createReactClass from 'create-react-class';

import HubMessageStore from 'stores/HubMessageStore';

import BrowserUtils from 'utils/BrowserUtils';
import Checkbox from 'components/semantic/Checkbox';

import ChatLayout from 'routes/Sidebar/components/chat/ChatLayout';
import HubUserTable from './HubUserTable';

import { ConnectStateEnum } from 'constants/HubConstants';
import AccessConstants from 'constants/AccessConstants';

import HubFooter from './HubFooter';
import { RedirectPrompt, PasswordPrompt, HubActionPrompt } from './HubPrompt';

import '../style.css';


const getStorageKey = (props) => {
  return 'view_userlist_' + props.session.id;
};

const checkList = (props) => {
  return BrowserUtils.loadSessionProperty(getStorageKey(props), false);
};

const HubSession = createReactClass({
  displayName: 'HubSession',

  componentWillMount() {
    this.showList = checkList(this.props);
  },

  getInitialState() {
    return {
      showList: checkList(this.props),
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.session.id !== this.props.session.id && this.state.showList !== checkList(nextProps)) {
      this.toggleListState();
    }
  },

  toggleListState() {
    this.setState({ showList: !this.state.showList });
  },

  getMessage() {
    const { session } = this.props;
    const connectState = session.connect_state.id;

    if (connectState === ConnectStateEnum.PASSWORD && !session.connect_state.has_password) {
      return (
        <HubActionPrompt 
          title="Password required"
          icon="lock"
          content={ <PasswordPrompt hub={ session }/> }
        />
      );
    }

    if (connectState === ConnectStateEnum.REDIRECT) {
      return (
        <HubActionPrompt 
          title="Redirect requested"
          icon="forward mail"
          content={ <RedirectPrompt hub={ session }/> }
        />
      );
    }

    return null;
  },

  onClickUsers() {
    this.toggleListState();

    BrowserUtils.saveSessionProperty(getStorageKey(this.props), this.state.showList);
  },

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
            chatAccess={ AccessConstants.HUBS_SEND }
            session={ session }
          />
        ) }
        <HubFooter
          userlistToggle={ checkbox }
          session={ session }
        />
      </div>
    );
  },
});

export default HubSession;