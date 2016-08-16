import React from 'react';
import invariant from 'invariant';
import classNames from 'classnames';

import { actionFilter, actionAccess } from 'utils/ActionUtils';
import { MenuItemLink } from 'components/semantic/MenuItem';
import EmptyDropdown from 'components/semantic/EmptyDropdown';


// Returns true if the provided ID matches the specified filter
const filterItem = (props, filter, actionId) => {
	const action = props.actions[actionId];
	if (!action) {
		invariant(actionId === 'divider', 'No action for action ID: ' + actionId);
		return true;
	}

	return filter(action, props.itemData);
};

// Get IDs matching the provided filter
const filterItems = (props, filter, actionIds) => {
	let ids = actionIds.filter(filterItem.bind(this, props, filter));
	if (ids.length === 0 || ids.every(id => id === 'divider')) {
		return null;
	}

	return ids;
};

const filterExtraDividers = (ids) => {
	return ids.filter((item, pos) => {
		if (item !== 'divider') {
			return true;
		}

		// The first or last element can't be a divider
		if (pos === 0 || pos === ids.length - 1) {
			return false;
		}

		// Check if the next element is also a divider 
		// (the last one would always be removed in the previous check)
		return ids[pos+1] !== 'divider';
	});
};

// Get IDs to display from the specified menu
const parseMenu = (props, hasPreviousMenuItems) => {
	let { ids } = props;
	if (!ids) {
		ids = Object.keys(props.actions);
	}

	// Only return a single error for each menu
	// Note the filtering order (no-access will be preferred over filtered)
	ids = filterItems(props, actionAccess, ids);
	if (!ids) {
		return 'no-access';
	}

	ids = filterItems(props, actionFilter, ids);
	if (!ids) {
		return 'filtered';
	}

	// Remove unwanted dividers
	ids = filterExtraDividers(ids);

	// Always add a divider before submenus
	if (hasPreviousMenuItems) {
		ids = [ 'divider', ...ids ];
	}

	return {
		actionIds: ids,
		itemData: props.itemData,
		actions: props.actions,
	};
};

// This should be used only for constructed menus, not for id arrays
const notError = (id) => typeof id !== 'string';


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
			 * Use button style for the trigger
			 */
			button: React.PropTypes.bool,
		},

		contextTypes: {
			routerLocation: React.PropTypes.object.isRequired,
		},

		shouldComponentUpdate: function (nextProps, nextState) {
			return nextProps.itemData !== this.props.itemData;
		},

		// Convert ID to menu link element
		getItem(menu, actionId, index) {
			if (actionId === 'divider') {
				return <div key={ 'divider' + index } className="ui divider"/>;
			}

			// A custom element
			if (typeof actionId !== 'string') {
				return actionId;
			}

			const action = menu.actions[actionId];
			return (
				<MenuItemLink 
					key={ actionId } 
					onClick={ () => action(menu.itemData, this.context.routerLocation) }
					icon={ action.icon }
				>
					{ action.displayName }
				</MenuItemLink>);
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
					menus.push(parseMenu(child.props, notError(menus[0])));
				});
			}

			// Are there any items to show?
			if (!menus.some(notError)) {
				if (this.props.button) {
					return null;
				}

				const dropdownClassName = classNames(
					{ 'no-access': menus.indexOf('no-access') !== -1 },
					{ 'filtered': menus.indexOf('filtered') !== -1 },
					this.props.className,
				);

				return (
					<EmptyDropdown
						caption={ this.props.caption }
						className={ dropdownClassName }
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
