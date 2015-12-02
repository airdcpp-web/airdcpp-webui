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
			if (actionId === 'divider') {
				return <div className="divider"></div>;
			}

			if (typeof actionId !== 'string') {
				return actionId;
			}

			const action = this.props.actions[actionId];
			return (
				<DropdownItem key={ actionId } onClick={ () => action(this.props.itemData, this.props.location) }>
					<i className={ action.icon + ' icon' }></i>
					{ action.displayName }
				</DropdownItem>);
		},

		render() {
			let { ids, actions, ...other } = this.props;
			if (!ids) {
				ids = Object.keys(actions);
			}

			return (
				<Component {...other}>
					{ ids.map(this.getItem) }
				</Component>
			);
		},
	});

	return ActionMenu;
}
