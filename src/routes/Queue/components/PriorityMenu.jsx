import React from 'react';
import isEqual from 'lodash/isEqual';

import { PriorityEnum } from 'constants/PriorityConstants';

import TableDropdown from 'components/semantic/TableDropdown';
import { MenuItemLink } from 'components/semantic/MenuItem';
import EmptyDropdown from 'components/semantic/EmptyDropdown';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';


const PriorityMenu = React.createClass({
	propTypes: {
		/**
		 * Priority object
		 */
		itemPrio: React.PropTypes.object.isRequired,

		/**
		 * Item with priority properties
		 */
		item: React.PropTypes.object.isRequired,

		prioAction: React.PropTypes.func.isRequired,

		autoPrioAction: React.PropTypes.func.isRequired,
	},

	setPriority: function (priorityId) {
		this.props.prioAction(this.props.item, priorityId);
	},

	toggleAutoPriority: function () {
		this.props.autoPrioAction(this.props.item, !this.props.itemPrio.auto);
	},

	shouldComponentUpdate: function (nextProps, nextState) {
		return !isEqual(nextProps.item.priority, this.props.item.priority);
	},

	getPriorityListItem: function (priority) {
		return (
			<MenuItemLink 
				key={ priority.id }
				active={ this.props.item.priority.id === priority.id } 
				onClick={ () => this.setPriority(priority.id) }
			>
				{ priority.str }
			</MenuItemLink>
		);
	},

	render: function () {
		let caption = this.props.itemPrio.str;
		if (this.props.itemPrio.auto) {
			caption += ' (auto)';
		}

		if (!LoginStore.hasAccess(AccessConstants.QUEUE_EDIT)) {
			return (
				<EmptyDropdown
					caption={ caption }
				/>
			);
		}

		let children = Object.keys(PriorityEnum.properties).map(prioKey => this.getPriorityListItem(PriorityEnum.properties[prioKey]));
		children.push(<div key="divider" className="ui divider"/>);
		children.push(
			<MenuItemLink 
				key="auto"
				active={ this.props.itemPrio.auto } 
				onClick={ this.toggleAutoPriority }
			>
				Auto
			</MenuItemLink>
		);

		return (
			<TableDropdown caption={ caption } className="priority-menu">
				{ children }
			</TableDropdown>
		);
	}
});

export default PriorityMenu;