import React from 'react';

import { PriorityEnum } from 'constants/QueueConstants';
import QueueActions from 'actions/QueueActions';

import TableDropdown from 'components/semantic/TableDropdown';
import DropdownItem from 'components/semantic/DropdownItem';

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

	getPriorityListItem: function (priority) {
		return (
			<DropdownItem 
				active={ this.props.item.priority.id === priority.id } 
				onClick={ () => this.setPriority(priority) }
			>
				{ priority.str }
			</DropdownItem>
		);
	},

	render: function () {
		return (
			<TableDropdown caption={ this.props.itemPrio.str }>
				{ Object.keys(PriorityEnum.properties).map((prioKey) => this.getPriorityListItem(PriorityEnum.properties[prioKey])) }
			</TableDropdown>
		);
	}
});

export default PriorityMenu;