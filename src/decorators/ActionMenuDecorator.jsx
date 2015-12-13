import React from 'react';

import LoginStore from 'stores/LoginStore';
import DropdownItem from 'components/semantic/DropdownItem';

export default function (Component) {
	const ActionMenu = React.createClass({
		propTypes: {

			/**
			 * Item to be passed to the actions
			 */
			itemData: React.PropTypes.any,

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

		filterItem(actionId) {
			const action = this.props.actions[actionId];
			if (!action) {
				return true;
			}

			if (action.filter && !action.filter(this.props.itemData)) {
				return false;
			}

			if (action.access && !LoginStore.hasAccess(action.access)) {
				return false;
			}

			return true;
		},

		getItem(actionId) {
			if (actionId === 'divider') {
				// TODO: support multiple dividers
				return <div key="divider" className="ui divider"></div>;
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

			ids = ids.filter(this.filterItem);
			if (ids.length === 0 || ids.every(id => id === 'divider')) {
				if (this.props.button) {
					return null;
				}

				return (
					<span>
						{ this.props.caption }
					</span>
				);
			}

			return (
				<Component {...other}>
					{ ids
						.map(this.getItem) }
				</Component>
			);
		},
	});

	return ActionMenu;
}
