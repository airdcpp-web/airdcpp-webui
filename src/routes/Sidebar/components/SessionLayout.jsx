import React from 'react';

import History from 'utils/History';
import Loader from 'components/semantic/Loader';

import TopMenuLayout from './TopMenuLayout';
import SideMenuLayout from './SideMenuLayout';

import '../sessions.css';

import { ActionMenu } from 'components/menu/DropdownMenu';
import SessionNewButton from './SessionNewButton';
import SessionMenuItem from './SessionMenuItem';
import Message from 'components/semantic/Message';

import LoginStore from 'stores/LoginStore';
import BrowserUtils from 'utils/BrowserUtils';


const SessionLayout = React.createClass({
	propTypes: {
		/**
		 * Unique ID of the section (used for storing and loading the previously open tab)
		 */
		baseUrl: React.PropTypes.string.isRequired,

		/**
		 * Location object
		 */
		location: React.PropTypes.object.isRequired,

		/**
		 * Item URL
		 */
		itemUrl: React.PropTypes.string.isRequired,

		/**
		 * Array of the items to list
		 */
		items: React.PropTypes.array.isRequired,

		/**
		 * Function receiving an item object that returns the display name
		 */
		itemNameGetter: React.PropTypes.func.isRequired,

		/**
		 * Function receiving an item object that returns header for the currently active item
		 * If no function is supplied, the item name will be used
		 */
		itemHeaderGetter: React.PropTypes.func,

		/**
		 * Function receiving an item object that returns the description (subheader) of the item
		 */
		itemDescriptionGetter: React.PropTypes.func,

		/**
		 * Function receiving an item object that returns icon for a item
		 */
		itemIconGetter: React.PropTypes.func.isRequired,

		/**
		 * Store containing information about unread items
		 */
		unreadInfoStore: React.PropTypes.object,

		/**
		 * Function receiving the circular color label in front of the item
		 */
		itemStatusGetter: React.PropTypes.func.isRequired,

		/**
		 * Session actions (should contain 'removeSession')
		 */
		actions: React.PropTypes.object.isRequired,

		/**
		 * Item ID that is currently active (if any)
		 */
		activeId: React.PropTypes.any,

		/**
		 * Label for button that opens a new session
		 */
		newButtonCaption: React.PropTypes.any,

		/**
		 * Set to false if the side menu should never be shown (the session will use all width that is available)  
		 */
		disableSideMenu: React.PropTypes.bool,

		/**
		 * AccessConstant defining whether the user has edit permission 
		 */
		editAccess: React.PropTypes.string.isRequired,
	},

	contextTypes: {
		history: React.PropTypes.object.isRequired
	},
	
	getInitialProps() {
		return {
			sideMenu: true,
		};
	},

	getInitialState() {
		return {
			activeItem: null
		};
	},

	getUrl(id) {
		return '/' + this.props.itemUrl + '/' + id;
	},

	redirectTo(id) {
		History.replaceSidebar(this.props.location, this.getUrl(id));
	},

	findItem(items, id) {
		return items.find(item => item.id == id); // Ignore the type because of local storage
	},

	componentWillReceiveProps(nextProps) {
		if (!nextProps.activeId) {
			if (this.state.activeItem) {
				this.setState({ activeItem: null });
			}
			return;
		}

		if (this.checkActiveItem(nextProps)) {
			// We got an item
			return;
		}

		// The old tab was closed


		// Find the old position and use the item in that position (if possible)
		const oldItem = this.findItem(this.props.items, this.props.activeId);
		const oldPos = this.props.items.indexOf(oldItem);

		let newItemPos = oldPos;
		if (oldPos === this.props.items.length-1) {
			// The last item was removed
			newItemPos = oldPos-1;
		}

		this.redirectTo(nextProps.items[newItemPos].id);
	},

	// Common logic for selecting the item to display (after mounting or session updates)
	// Returns true active item selection was handled
	// Returns false if the active item couldn't be selected but there are valid items to choose from by the caller
	checkActiveItem(props) {
		// Did we just create this session?
		const { pending } = History.getSidebarData(props.location);

		// Update the active item
		const activeItem = this.findItem(props.items, props.activeId);
		if (activeItem) {
			if (pending) {
				// Disable pending state
				History.replaceSidebarData(props.location, {
					pending: false
				});

				return true;
			}

			this.setState({ activeItem: activeItem });
			localStorage.setItem(props.baseUrl + '_last_active', props.activeId);
			return true;
		} else if (pending) {
			// We'll just display a loading indicator in 'render', no item needed
			return true;
		} else if (props.location.action === 'POP' || props.items.length === 0) {
			// Browsing from history and item removed (or all items removed)... go to "new session" page
			History.replaceSidebar(props.location, this.getNewUrl());
			this.setState({ activeItem: null });
			return true;
		}

		return false;
	},

	getNewUrl() {
		if (!this.props.newButtonCaption) {
			return '/' + this.props.baseUrl;
		}

		return '/' + this.props.baseUrl + '/new';
	},

	componentWillMount() {
		// Opening an item directly? Or no items?
		if (this.checkActiveItem(this.props)) {
			return;
		}

		// See if we have something stored
		let lastId = localStorage.getItem(this.props.baseUrl + '_last_active');
		if (lastId && this.findItem(this.props.items, lastId)) {
			// Previous session exists
			this.redirectTo(lastId);
		} else if (this.props.items.length > 0) {
			// Load the first session
			this.redirectTo(this.props.items[0].id);
		}
	},

	getMenuItem(item) {
		return (
			<SessionMenuItem 
				key={ item.id } 
				url={this.getUrl(item.id)}
				location={this.props.location}
				nameGetter={this.props.itemNameGetter}
				unreadInfoStore={ this.props.unreadInfoStore }
				statusGetter={this.props.itemStatusGetter}
				item={item}
			/>
		);
	},

	getItemHeader() {
		const { activeItem } = this.state;
		if (!activeItem) {
			return null;
		}

		const actionMenu = (
			<ActionMenu 
				caption={ this.props.itemNameGetter(activeItem) }
				location={ location }
				actions={ this.props.actions }
				itemData={ activeItem }
				ids={ [ 'removeSession' ] }
			/>
		);

		return this.props.itemHeaderGetter ? this.props.itemHeaderGetter(activeItem, location, actionMenu) : actionMenu;
	},

	getItemIcon() {
		const { activeItem } = this.state;
		if (!activeItem) {
			return null;
		}

		return this.props.itemIconGetter(activeItem);
	},

	getNewButton(hasEditAccess) {
		if (!hasEditAccess || !this.props.newButtonCaption) {
			return null;
		}

		return (
			<SessionNewButton 
				key="new-button" 
				title={this.props.newButtonCaption} 
				location={this.props.location} 
				url={this.getNewUrl()} 
			/>
		);
	},

	render() {
		const hasEditAccess = LoginStore.hasAccess(this.props.editAccess);

		// Menu items
		const menuItems = this.props.items.map(this.getMenuItem);

		const { activeItem } = this.state;

		// Children
		let children = this.props.children;
		if (History.getSidebarData(this.props.location).pending) {
			children = <Loader text="Waiting for server response"/>;
		} else if (activeItem) {
			children = React.cloneElement(children, { 
				item: activeItem 
			});
		} else if (this.props.activeId) {
			children = <Loader/>;
		} else if (!hasEditAccess) {
			return <Message title="No items to show" description="You aren't allowed to open new sessions"/>;
		}

		const Component = this.props.disableSideMenu || BrowserUtils.useMobileLayout() ? TopMenuLayout : SideMenuLayout;
		return (
			<Component 
				itemIcon={ this.getItemIcon() }
				itemHeader={ this.getItemHeader() }
				itemDescriptionGetter={ this.props.itemDescriptionGetter }
				activeItem={ activeItem }
				unreadInfoStore={ this.props.unreadInfoStore }

				newButton={ this.getNewButton(hasEditAccess) }
				menuItems={ menuItems }
				location={ this.props.location }
			>
				{ children }
			</Component>
		);
	}
});

export default SessionLayout;
