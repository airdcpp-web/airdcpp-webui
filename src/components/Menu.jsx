import React from 'react';
import Reflux from 'reflux';

import TableDropdown, { DropdownItem } from './semantic/TableDropdown'
import { Icon, Item } from 'react-semantify'
import FileUtils from 'utils/FileUtils'

import UserActions from 'actions/UserActions'
import DownloadActions from 'actions/DownloadActions'

export const ActionMenu = React.createClass({
  propTypes: {

    /**
     * Item to be passed to the actions
     */
    itemData: React.PropTypes.any.isRequired,

    /**
     * Menu item actions
     */
    actions: React.PropTypes.object.isRequired,

    /**
     * Action ids to filter from all actions
     */
    ids: React.PropTypes.array,

    /**
     * Router location
     */
    location: React.PropTypes.object,
  },

  getItem(actionId) {
    const action = this.props.actions[actionId];
    return (
      <DropdownItem key={ actionId } onClick={ () => action(this.props.itemData, this.props.location) }>
        <i className={ action.icon + " icon" }></i>
        { action.displayName }
      </DropdownItem>);
  },

  filterItem(actionId) {
    if (this.props.ids) {
      return this.props.ids.indexOf(actionId) > -1;
    }

    return true;
  },

  render() {
    return (
      <TableDropdown caption={ this.props.caption }>
        {Object.keys(this.props.actions).filter(this.filterItem).map(this.getItem)}
      </TableDropdown>
    );
  }
});

export const UserMenu = React.createClass({
  propTypes: {

    /**
     * Filelist directory to use for browsing the list
     */
    directory: React.PropTypes.string,

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
  },

  getDefaultProps() {
    return {
      directory: '/'
    }
  },

  render: function() {
    const { directory, user } = this.props;
    const data = {
      user: user,
      directory: FileUtils.getFilePath(directory)
    }

    const caption = (
      <div>
        <Icon className="blue user"/>
        { user.nicks }
      </div>);

    return <ActionMenu location={this.props.location} caption={ caption } actions={ UserActions } ids={[ "browse", "message" ]} itemData={ data }/>;
  }
});

export const DownloadMenu = React.createClass({
  propTypes: {

    /**
     * Possible entity to be passed to the handler (when not used for items in a singleton entity)
     */
    parentEntity: React.PropTypes.any,

    /**
     * Function for handling the download
     */
    handler: React.PropTypes.func.isRequired,

    /**
     * Additional data to be passed to the handler
     */
    itemInfo: React.PropTypes.any,

    /**
     * Location from component props
     */
    location: React.PropTypes.object.isRequired
  },

  render: function() {
    const { handler, parentEntity, itemInfo, location } = this.props;
    const data = {
      parentEntity: parentEntity,
      handler: handler,
      itemInfo: itemInfo,
      location: location
    }

    return <ActionMenu caption={ this.props.caption } actions={ DownloadActions } ids={[ "download", "downloadTo" ]} itemData={ data }/>;
  }
})