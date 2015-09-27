import React from 'react';
import Reflux from 'reflux';
import TableDropdown, { DropdownItem } from './semantic/TableDropdown'
import { Icon, Item } from 'react-semantify'

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
    ids: React.PropTypes.array
  },

  getItem(actionId) {
    return (
      <DropdownItem key={ actionId } onClick={ () => this.props.actions[actionId](this.props.itemData) }>
        <i className={ this.props.actions[actionId].icon + " icon" }></i>
        { this.props.actions[actionId].displayName }
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
    }).isRequired
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
      directory: directory
    }

    const caption = (
      <div>
        <Icon className="blue user"/>
        { user.nicks }
      </div>);

    return <ActionMenu caption={ caption } actions={ UserActions } ids={[ "browse", "message" ]} itemData={ data }/>;
  }
});

export const DownloadMenu = React.createClass({
  propTypes: {

    /**
     * Item ID to be passed to the handler
     */
    id: React.PropTypes.number,

    /**
     * Function for handling the download
     */
    handler: React.PropTypes.func.isRequired
  },

  render: function() {
    const { handler, id, itemInfo } = this.props;
    const data = {
      id: id,
      handler: handler,
      itemInfo: itemInfo
    }

    return <ActionMenu caption={ this.props.caption } actions={ DownloadActions } ids={[ "download", "downloadTo" ]} itemData={ data }/>;
  }
})