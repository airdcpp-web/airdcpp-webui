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
import { LocationContext } from 'mixins/RouterMixin';

import IconConstants from 'constants/IconConstants';
import { MenuItemLink } from 'components/semantic/MenuItem';


const findItem = (items, id) => {
	return items.find(item => item.id === id);
};

const SessionLayout = React.createClass({
	mixins: [ LocationContext ],
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
		itemDescriptionGetter: React.PropTypes.func.isRequired,

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
		itemStatusGetter: React.PropTypes.func,

		/**
		 * Session actions (should contain 'removeSession')
		 */
		actions: React.PropTypes.object.isRequired,

		/**
		 * Session actions to show in the action menu
		 */
		actionIds: React.PropTypes.array,

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

	// HELPERS
	getUrl(id) {
		return '/' + this.props.baseUrl + '/session/' + id;
	},

	getNewUrl() {
		if (!this.props.newButtonCaption || !this.hasEditAccess()) {
			return '/' + this.props.baseUrl;
		}

		return '/' + this.props.baseUrl + '/new';
	},

	getStorageKey(props) {
		return props.baseUrl + '_last_active';
	},

	pushSession(id) {
		History.pushSidebar(this.props.location, this.getUrl(id));
	},

	replaceSession(id) {
		History.replaceSidebar(this.props.location, this.getUrl(id));
	},

	pushNew() {
		History.pushSidebar(this.props.location, this.getNewUrl());
	},

	hasEditAccess() {
		return LoginStore.hasAccess(this.props.editAccess);
	},

	// LIFECYCLE/REACT
	componentWillReceiveProps(nextProps) {
		if (!nextProps.activeId && (nextProps.items.length === 0 || nextProps.children)) {
			// Don't redirect to it if the "new session" layout is open
			if (this.state.activeItem) {
				this.setState({ activeItem: null });
			}
			return;
		}

		if (this.checkActiveItem(nextProps)) {
			// We got an item
			return;
		}

		// The old tab was closed or we didn't have any session before


		let newItemPos = 0;
		const oldItem = findItem(this.props.items, this.props.activeId);
		if (oldItem) {
			// Find the old position and use the item in that position (if possible)
			newItemPos = this.props.items.indexOf(oldItem);
			if (newItemPos === this.props.items.length-1) {
				// The last item was removed
				newItemPos = newItemPos - 1;
			}
		}

		this.replaceSession(nextProps.items[newItemPos].id);
	},

	// Common logic for selecting the item to display (after mounting or session updates)
	// Returns true active item selection was handled
	// Returns false if the active item couldn't be selected but there are valid items to choose from by the caller
	checkActiveItem(props) {
		// Did we just create this session?
		const routerLocation = props.location;
		const { pending } = History.getSidebarData(routerLocation);

		// Update the active item
		const activeItem = findItem(props.items, props.activeId);
		if (activeItem) {
			if (pending) {
				// Disable pending state
				History.replaceSidebarData(routerLocation, {
					pending: false
				});

				return true;
			}

			this.setState({ activeItem: activeItem });
			BrowserUtils.saveLocalProperty(this.getStorageKey(props), props.activeId);
			return true;
		} else if (pending) {
			// We'll just display a loading indicator in 'render', no item needed
			return true;
		} else if (routerLocation.action === 'POP' || props.items.length === 0) {
			// Browsing from history and item removed (or all items removed)... go to "new session" page
			History.replaceSidebar(routerLocation, this.getNewUrl());
			this.setState({ activeItem: null });
			return true;
		}

		return false;
	},

	onKeyDown(event) {
		const { keyCode, altKey } = event;

		if (keyCode >= 49 && keyCode <= 57 && altKey) {
			// Alt + 1-9
			event.preventDefault();

			const newSession = this.props.items[keyCode - 49];
			if (newSession) {
				this.pushSession(newSession.id);
			}
		} else if (altKey && (keyCode === 38 || keyCode === 40)) {
			// Arrow up/down
			event.preventDefault();

			const item = findItem(this.props.items, this.props.activeId);
			const currentIndex = this.props.items.indexOf(item);
			if (currentIndex === -1) {
				return;
			}

			const newSession = this.props.items[keyCode === 38 ? currentIndex - 1 : currentIndex + 1];
			if (newSession) {
				this.pushSession(newSession.id);
			}
		} else if (altKey && keyCode === 45) {
			// Insert
			event.preventDefault();

			History.replaceSidebar(this.props.location, this.getNewUrl());
		} else if (altKey && keyCode === 46) {
			// Delete
			event.preventDefault();

			const item = findItem(this.props.items, this.props.activeId);
			if (item) {
				this.props.actions.removeSession(item);
			}
		}
	},

	componentWillMount() {
		window.addEventListener('keydown', this.onKeyDown);

		// Opening an item directly? Or no items?
		if (this.checkActiveItem(this.props)) {
			return;
		}

		// See if we have something stored
		let lastId = BrowserUtils.loadLocalProperty(this.getStorageKey(this.props));
		if (lastId && findItem(this.props.items, lastId)) {
			// Previous session exists
			this.replaceSession(lastId);
		} else if (this.props.items.length > 0) {
			// Load the first session
			this.replaceSession(this.props.items[0].id);
		}
	},

	componentWillUnmount() {
		window.removeEventListener('keydown', this.onKeyDown);;
	},

	// COMPONENT GETTERS
	getItemStatus(item) {
		if (this.props.itemStatusGetter) {
			return <div className={ 'ui session-status empty circular left mini label ' + this.props.itemStatusGetter(item) }/>;
		}

		return this.props.itemIconGetter(item);
	},

	getSessionMenuItem(sessionItem) {
		return (
			<SessionMenuItem 
				key={ sessionItem.id } 
				url={ this.getUrl(sessionItem.id) }
				name={ this.props.itemNameGetter(sessionItem) }
				unreadInfoStore={ this.props.unreadInfoStore }
				status={ this.getItemStatus(sessionItem) }
				sessionItem={ sessionItem }
				pushSession={ this.pushSession }
			/>
		);
	},

	getItemHeader() {
		const { activeItem } = this.state;
		if (!activeItem) {
			return null;
		}

		const { actions, actionIds, itemNameGetter, itemHeaderGetter } = this.props;

		let ids = [ 'removeSession' ];
		if (actionIds) {
			ids = [ ...actionIds, 'divider', ...ids ];
		}

		const actionMenu = (
			<ActionMenu 
				caption={ itemNameGetter(activeItem) }
				actions={ actions }
				itemData={ activeItem }
				ids={ ids }
			/>
		);

		// Use the header getter only if there is a getter that returns a valid value
		if (itemHeaderGetter) {
			const header = itemHeaderGetter(activeItem, this.props.location, actionMenu);
			if (header) {
				return header;
			}
		}

		return actionMenu;
	},

	getItemIcon() {
		const { activeItem } = this.state;
		if (!activeItem) {
			return null;
		}

		return this.props.itemIconGetter(activeItem);
	},

	getNewButton() {
		if (!this.hasEditAccess() || !this.props.newButtonCaption) {
			return null;
		}

		return (
			<SessionNewButton 
				key="new-button" 
				title={ this.props.newButtonCaption } 
				url={ this.getNewUrl() } 
				pushNew={ this.pushNew }
			/>
		);
	},

	getChildren() {
		const { activeItem } = this.state;
		const { children, items, actions, activeId } = this.props;
		if (History.getSidebarData(this.props.location).pending) {
			// The session was just created
			return <Loader text="Waiting for server response"/>;
		} else if (activeItem) {
			// We have a session
			return React.cloneElement(this.props.children, { 
				session: activeItem,
				actions: actions,
			});
		} else if (activeId || (!children && items.length !== 0)) {
			// Redirecting to a new page
			return <Loader text="Loading session"/>;
		} else if (!this.hasEditAccess() && items.length === 0) {
			// Nothing to show
			return <Message title="No items to show" description="You aren't allowed to open new sessions"/>;
		}

		// New layout
		return children;
	},

	getListActionMenu() {
		const { actions, items } = this.props;
		if (!this.hasEditAccess() || items.length === 0) {
			return null;
		}

		return (
			<MenuItemLink 
				key="close"
				onClick={ () => items.forEach(session => actions.removeSession(session)) }
				icon={ IconConstants.REMOVE }
			>
				Close all
			</MenuItemLink>
		);
	},

	render() {
		const children = this.getChildren();

		const { disableSideMenu, width } = this.props;
		const useTopMenu = disableSideMenu || BrowserUtils.useMobileLayout() || width < 700;
		
		const Component = useTopMenu ? TopMenuLayout : SideMenuLayout;
		return (
			<Component 
				itemIcon={ this.getItemIcon() }
				itemHeader={ this.getItemHeader() }
				itemDescriptionGetter={ this.props.itemDescriptionGetter }
				activeItem={ this.state.activeItem }
				unreadInfoStore={ this.props.unreadInfoStore }
				closeAction={ this.props.actions.removeSession }
				newButton={ this.getNewButton() }
				sessionMenuItems={ this.props.items.map(this.getSessionMenuItem) }
				listActionMenuGetter={ this.getListActionMenu }
			>
				{ children }
			</Component>
		);
	}
});

export default SessionLayout;
