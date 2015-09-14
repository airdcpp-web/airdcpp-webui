import React from 'react';
import Reflux from 'reflux';
import TableDropdown, { DropdownItem } from './semantic/TableDropdown'
import { Icon, Item } from 'react-semantify'


/*const ActionItem = React.createClass({
  render() {
    return (
      <Item key="2" onClick={ this.handleSearchBundle.bind(this, rowData.id) }><a>{ 'Search for alternates' }</a></Item>
    );
  }
});*/

export default React.createClass({
  propTypes: {

    /**
     * Item to be passed to the actions
     */
    itemData: React.PropTypes.node,

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