import React from 'react';

import DropdownItem from 'components/semantic/DropdownItem';

export default function (Component) {
	const ActionMenu = React.createClass({
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

		shouldComponentUpdate: function (nextProps, nextState) {
			return nextProps.itemData !== this.props.itemData;
		},

		getItem(actionId) {
			const action = this.props.actions[actionId];
			return (
				<DropdownItem key={ actionId } onClick={ () => action(this.props.itemData, this.props.location) }>
					<i className={ action.icon + ' icon' }></i>
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
			const { ids, actions, itemData, ...other } = this.props;

			return (
				<Component {...other}>
					{Object.keys(this.props.actions).filter(this.filterItem).map(this.getItem)}
				</Component>
			);
		},
	});

	return ActionMenu;
}
