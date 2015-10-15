'use strict';

import React from 'react';

import SocketService from 'services/SocketService.js'

import FilelistSessionStore from 'stores/FilelistSessionStore'
import FilelistActions from 'actions/FilelistActions'

import { ActionMenu } from 'components/Menu'
import UserActions from 'actions/UserActions'

import TabHeader from 'routes/Sidebar/components/TabHeader'
import Format from 'utils/Format'

const UserTitleMenu = React.createClass({
  propTypes: {
    /**
     * Hinted user
     */
    user: React.PropTypes.shape({
      cid: React.PropTypes.string,
      hub_url: React.PropTypes.string
    }).isRequired,

    /**
     * Router location
     */
    location: React.PropTypes.object.isRequired,

    /**
     * Action ids to filter from all actions
     */
    ids: React.PropTypes.array,
  },

  getDefaultProps() {
    return {
      ids: null
    }
  },

  render: function() {
    const { user, ...other } = this.props;
    const data = {
      user: user,
      directory: '/'
    }

    return <ActionMenu { ...other } caption={ this.props.user.nicks } actions={ UserActions } itemData={ data }/>;
  }
});

const FilelistSession = React.createClass({
  displayName: "FilelistSession",
  handleClose() {
    FilelistActions.removeSession(this.props.item.id);
  },

  render() {
    const { user } = this.props.item;
    const userMenu = (
      <UserTitleMenu user={ user } location={this.props.location} ids={["browser"]}/>
    );

    const icon = (
      <Format.UserIconFormatter size="large" flags={user.flags} />
    );

    return (
      <div className="filelist-session session-layout">
        <TabHeader
          icon={icon}
          title={userMenu}
          buttonClickHandler={this.handleClose}
          subHeader={ user.hub_names }/>

        <MessageView
          messages={this.props.messages}
          handleSend={this.handleSend}
        />
      </div>
    );
  },
});

export default FilelistSession;