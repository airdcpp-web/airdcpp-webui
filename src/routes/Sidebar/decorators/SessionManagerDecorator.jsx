import React from 'react';

import { Link } from 'react-router';

import History from 'utils/History';
import Loader from 'components/semantic/Loader';

import '../sessions.css';

const MenuItem = React.createClass({
	propTypes: {
		/**
		 * Location object
		 */
		location: React.PropTypes.object.isRequired,

		/**
		 * Item URL
		 */
		url: React.PropTypes.string.isRequired,
	},

	contextTypes: {
		history: React.PropTypes.object.isRequired
	},

	onClick: function (evt) {
		evt.preventDefault();

		History.pushSidebar(this.props.location, this.props.url);
	},

	render: function () {
		const { item } = this.props;
		return (
			<Link to={this.props.url} className="item session-item" onClick={this.onClick} activeClassName="active">
				<div className="left-content">
					<div className={ 'ui session-status empty circular left mini label ' + this.props.statusGetter(item) }/>
					{ this.props.nameGetter(item) }
				</div>
				{ this.props.labelGetter(item) }
			</Link>
		);
	}
});

const NewButton = React.createClass({
	propTypes: {
		/**
		 * Location object
		 */
		location: React.PropTypes.object.isRequired,

		/**
		 * Base URL of the section
		 */
		url: React.PropTypes.string.isRequired,

		/**
		 * Title of the button
		 */
		title: React.PropTypes.node.isRequired,
	},

	onClick: function (evt) {
		evt.preventDefault();

		History.pushSidebar(this.props.location, this.props.url);
	},

	render: function () {
		return (
			<Link to={this.props.url} className="item button-new" onClick={this.onClick}>
				<div className={this.props.buttonClass}>
					<i className="plus icon"></i>
					{this.props.title}
				</div>
			</Link>
		);
	}
});

export default function (Component, buttonClass = '') {
	const SessionManagerDecorator = React.createClass({
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
			nameGetter: React.PropTypes.func.isRequired,

			/**
			 * Function receiving label after the name (unread count etc.)
			 */
			labelGetter: React.PropTypes.func.isRequired,

			/**
			 * Function receiving the circular color label in front of the item
			 */
			statusGetter: React.PropTypes.func.isRequired,

			/**
			 * Item ID that is currently active (if any)
			 */
			activeId: React.PropTypes.any,

			/**
			 * Label for button that opens a new session
			 */
			newButtonLabel: React.PropTypes.any.isRequired
		},

		contextTypes: {
			history: React.PropTypes.object.isRequired
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

		render() {
			const menuItems = this.props.items.map(item => {
				const id = item.id;
				return (
					<MenuItem 
						key={ id } 
						url={this.getUrl(id)}
						location={this.props.location}
						nameGetter={this.props.nameGetter}
						labelGetter={this.props.labelGetter}
						statusGetter={this.props.statusGetter}
						item={item}
					/>
				);
			}, this);

			let children = this.props.children;
			if (History.getSidebarData(this.props.location).pending) {
				children = <Loader text="Waiting for server response"/>;
			} else if (this.state.activeItem) {
				children = React.cloneElement(children, { item: this.state.activeItem });
			}

			return (
				<Component 
					children={children}
					newButton={
						<NewButton 
							key="new-button" 
							title={this.props.newButtonLabel} 
							location={this.props.location} 
							url={this.getNewUrl()} 
							buttonClass={buttonClass}
						/>
					}
					menuItems={menuItems}
					location={this.props.location}
				/>
			);
		}
	});

	return SessionManagerDecorator;
}
