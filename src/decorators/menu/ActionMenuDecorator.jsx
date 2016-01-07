import React from 'react';
import invariant from 'invariant';
import classNames from 'classnames';

import LoginStore from 'stores/LoginStore';
import DropdownItem from 'components/semantic/DropdownItem';


const filterAction = ({ itemData }, action) => {
	return !action.filter || action.filter(itemData);
};

const filterAccess = ({ itemData }, action) => {
	return !action.access || LoginStore.hasAccess(action.access);
};

// Returns true if the provided ID matches the specified filter
const filterItem = (props, filter, actionId) => {
	const action = props.actions[actionId];
	if (!action) {
		invariant(actionId === 'divider', 'No action for action ID');
		return true;
	}

	return filter(props, action);
};

// Get IDs matching the provided filter
const filterItems = (props, filter, actionIds) => {
	let ids = actionIds.filter(filterItem.bind(this, props, filter));
	if (ids.length === 0 || ids.every(id => id === 'divider')) {
		return null;
	}

	return ids;
};

// Get IDs to display from the specified menu
const parseMenu = (props, subMenu, hasPreviousItems) => {
	let { ids } = props;
	if (!ids) {
		ids = Object.keys(props.actions);
	}

	// Only return a single error for each menu
	// Note the filtering order (no-access will be preferred over filtered)
	ids = filterItems(props, filterAccess, ids);
	if (!ids) {
		return 'no-access';
	}

	ids = filterItems(props, filterAction, ids);
	if (!ids) {
		return 'filtered';
	}

	// Show a divider before submenus
	if (subMenu && hasPreviousItems) {
		ids = [ 'divider', ...ids ];
	}

	return {
		actionIds: ids,
		itemData: props.itemData,
		actions: props.actions,
	};
};

const notError = (id) => typeof id !== 'string';


const EmptyMenu = ({ menus, caption }) => {
	const className = classNames(
		'empty-dropdown',
		{ 'no-access': menus.indexOf('no-access') !== -1 },
		{ 'filtered': menus.indexOf('filtered') !== -1 },
	);

	return (
		<span className={ className }>
			{ caption }
		</span>
	);
};

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

			/**
			 * Use button style for the trigger
			 */
			button: React.PropTypes.bool,
		},

		shouldComponentUpdate: function (nextProps, nextState) {
			return nextProps.itemData !== this.props.itemData;
		},

		// Convert ID to DropdownItem
		getItem(menu, actionId, index) {
			if (actionId === 'divider') {
				return <div key={ 'divider' + index } className="ui divider"></div>;
			}

			// A custom element
			if (typeof actionId !== 'string') {
				return actionId;
			}

			const action = menu.actions[actionId];
			return (
				<DropdownItem key={ actionId } onClick={ () => action(menu.itemData, this.props.location) }>
					<i className={ action.icon + ' icon' }/>
					{ action.displayName }
				</DropdownItem>);
		},

		// Reduce menus to an array of DropdownItems
		reduceMenus(items, menu) {
			items.push(...menu.actionIds.map(this.getItem.bind(this, menu)));
			return items;
		},

		render() {
			let { ids, actions, children, ...other } = this.props;

			const menus = [ parseMenu(this.props) ];
			if (children) {
				React.Children.map(children, child => {
					menus.push(parseMenu(child.props, true, notError(menus[0])));
				});
			}

			// Are there any items to show?
			if (!menus.some(notError)) {
				return (
					<EmptyMenu
						caption={ this.props.caption }
						menus={ menus }
					/>
				);
			}

			return (
				<Component {...other}>
					{ menus
						.filter(notError)
						.reduce(this.reduceMenus, []) 
					}
				</Component>
			);
		},
	});

	return ActionMenu;
}
