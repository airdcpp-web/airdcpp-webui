import React from 'react';

import { PriorityEnum } from 'constants/QueueConstants';
import QueueActions from 'actions/QueueActions';

import TableDropdown from 'components/semantic/TableDropdown';
import DropdownItem from 'components/semantic/DropdownItem';

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
	},

	setPriority: function (priority) {
		QueueActions.setBundlePriority(this.props.item.id, priority.id);
	},

	shouldComponentUpdate: function (nextProps, nextState) {
		return nextProps.item.priority.id !== this.props.item.priority.id;
	},

	getPriorityListItem: function (priority) {
		return (
			<DropdownItem 
				key={ priority.id }
				active={ this.props.item.priority.id === priority.id } 
				onClick={ () => this.setPriority(priority) }
			>
				{ priority.str }
			</DropdownItem>
		);
	},

	render: function () {
		const caption = this.props.itemPrio.str;
		if (!LoginStore.hasAccess(AccessConstants.QUEUE_EDIT)) {
			return <div className="empty-dropdown">{ caption }</div>;
		}

		return (
			<TableDropdown caption={ caption } className="priority-menu">
				{ Object.keys(PriorityEnum.properties).map((prioKey) => this.getPriorityListItem(PriorityEnum.properties[prioKey])) }
			</TableDropdown>
		);
	}
});

export default PriorityMenu;