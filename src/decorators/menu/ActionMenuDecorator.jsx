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
const parseMenu = (props, subMenu) => {
	let { ids } = props;
	if (!ids) {
		ids = Object.keys(props.actions);
	}

	// Only return a single error for each menu
	// Note the filtering order (no-access will be preferred over filtered)
	ids = filterItems(props, filterAccess, ids);
	if (!ids) {
		return [ 'no-access' ];
	}

	ids = filterItems(props, filterAction, ids);
	if (!ids) {
		return [ 'filtered' ];
	}

	// Show a divider before submenus
	if (subMenu) {
		ids = [ 'divider', ...ids ];
	}

	return ids;
};

const notError = (id) => id !== 'filtered' && id !== 'no-access';


const EmptyMenu = ({ combinedIds, caption }) => {
	const className = classNames(
		'empty-dropdown',
		{ 'no-access': combinedIds.indexOf('no-access') !== -1 },
		{ 'filtered': combinedIds.indexOf('filtered') !== -1 },
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
		getItem(actions, actionId, index) {
			if (actionId === 'divider') {
				return <div key={ 'divider' + index } className="ui divider"></div>;
			}

			// A custom element
			if (typeof actionId !== 'string') {
				return actionId;
			}

			const action = actions[actionId];
			return (
				<DropdownItem key={ actionId } onClick={ () => action(this.props.itemData, this.props.location) }>
					<i className={ action.icon + ' icon' }/>
					{ action.displayName }
				</DropdownItem>);
		},

		render() {
			let { ids, actions, children, ...other } = this.props;

			const combinedIds = parseMenu(this.props);
			const combinedActions = Object.assign({}, actions);

			if (children) {
				combinedIds.push(...parseMenu(children.props, true));
				Object.assign(combinedActions, children.props.actions);
			}

			// Are there any items to show?
			if (!combinedIds.some(notError)) {
				return (
					<EmptyMenu
						caption={ this.props.caption }
						combinedIds={ combinedIds }
					/>
				);
			}

			return (
				<Component {...other}>
					{ combinedIds
						.filter(notError)
						.map(this.getItem.bind(this, combinedActions)) 
					}
				</Component>
			);
		},
	});

	return ActionMenu;
}
