import React from 'react';
import deepEqual from 'deep-equal';

import { PriorityEnum } from 'constants/QueueConstants';

import TableDropdown from 'components/semantic/TableDropdown';
import DropdownItem from 'components/semantic/DropdownItem';
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
		return !deepEqual(nextProps.item.priority, this.props.item.priority);
	},

	getPriorityListItem: function (priority) {
		return (
			<DropdownItem 
				key={ priority.id }
				active={ this.props.item.priority.id === priority.id } 
				onClick={ () => this.setPriority(priority.id) }
			>
				{ priority.str }
			</DropdownItem>
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
			<DropdownItem 
				key="auto"
				active={ this.props.itemPrio.auto } 
				onClick={ this.toggleAutoPriority }
			>
				Auto
			</DropdownItem>
		);

		return (
			<TableDropdown caption={ caption } className="priority-menu">
				{ children }
			</TableDropdown>
		);
	}
});

export default PriorityMenu;