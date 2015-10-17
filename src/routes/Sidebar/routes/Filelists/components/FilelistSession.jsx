'use strict';

import React from 'react';

import ListBrowser from './ListBrowser'

import UserActions from 'actions/UserActions'
import FilelistActions from 'actions/FilelistActions'
import Format from 'utils/Format'

import { ActionMenu } from 'components/Menu'

import TabHeader from 'routes/Sidebar/components/TabHeader'

const FilelistSession = React.createClass({
  displayName: "FilelistSession",
  handleClose() {
    FilelistActions.removeSession(this.props.item.id);
  },

  stateToString(state) {
    switch(state) {
      case "download_pending": return "Download pending";
      case "downloading": return "Downloading";
      case "loading": return "Loading";
      default: return "Loaded";
    }
  },

  render() {
    const { user } = this.props.item;
    const userMenu = (
      <ActionMenu 
        location={this.props.location}
        caption={ user.nicks } 
        actions={ UserActions } 
        itemData={ user } 
        ids={["message"]}/>
    );

    const icon = (
      <Format.UserIconFormatter size="large" flags={user.flags} />
    );

    const state = this.props.item.state.id;
    return (
      <div className="filelist-session session-layout">
        <TabHeader
          icon={icon}
          title={userMenu}
          buttonClickHandler={this.handleClose}
          subHeader={ user.hub_names }/>

        { ((state !== "loaded") ? 
          (<div className="ui active text loader">{ this.stateToString(state) }</div>)
        : (
          <ListBrowser
            location={this.props.location}
            item={this.props.item}/>
          ))}
      </div>
    );
  },
});

export default FilelistSession;