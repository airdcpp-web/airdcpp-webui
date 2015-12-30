import React from 'react';

import LoginStore from 'stores/LoginStore';
import DropdownItem from 'components/semantic/DropdownItem';


const filterItem = (props, actionId) => {
	const action = props.actions[actionId];
	if (!action) {
		return true;
	}

	if (action.filter && !action.filter(props.itemData)) {
		return false;
	}

	if (action.access && !LoginStore.hasAccess(action.access)) {
		return false;
	}

	return true;
};

const getItem = (props, subMenu, actionId, index) => {
	if (actionId === 'divider') {
		// TODO: support multiple dividers
		return <div key={ 'divider' + subMenu + index } className="ui divider"></div>;
	}

	if (typeof actionId !== 'string') {
		return actionId;
	}

	const action = props.actions[actionId];
	return (
		<DropdownItem key={ actionId } onClick={ () => action(props.itemData, props.location) }>
			<i className={ action.icon + ' icon' }></i>
			{ action.displayName }
		</DropdownItem>);
};

const parseMenu = (props, subMenu) => {
	let { ids } = props;
	if (!ids) {
		ids = Object.keys(props.actions);
	}

	let actionIds = ids.filter(filterItem.bind(this, props));
	if (actionIds.length === 0 || actionIds.every(id => id === 'divider')) {
		return [];
	}

	if (subMenu) {
		actionIds = [ 'divider', ...actionIds ];
	}

	return actionIds.map(getItem.bind(this, props, subMenu));
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

		render() {
			let { ids, actions, children, ...other } = this.props;

			const items = parseMenu(this.props);
			if (children) {
				items.push(...parseMenu(children.props, true));

				/*children.forEach(child => {
					//const subItems = parseMenu(child.props);
					items.push(...parseMenu(child.props, true));
				});*/
			}

			if (items.length === 0) {
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
					{ items }
				</Component>
			);
		},
	});

	return ActionMenu;
}
