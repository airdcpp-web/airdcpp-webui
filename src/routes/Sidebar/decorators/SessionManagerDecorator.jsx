import React from 'react';

import { Link } from 'react-router';

import History from 'utils/History';


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

		/**
		 * Title of the button
		 */
		//title: React.PropTypes.any.isRequired,
	},

	contextTypes: {
		history: React.PropTypes.object.isRequired
	},

	displayName: 'MenuItem',
	onClick: function (evt) {
		evt.preventDefault();

		History.pushSidebar(this.props.location, this.props.url);
	},

	render: function () {
		const { item } = this.props;
		return (
			<Link to={'/sidebar/' + this.props.url} className="item session-item" onClick={this.onClick} activeClassName="active">
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
		baseUrl: React.PropTypes.string.isRequired,

		/**
		 * Title of the button
		 */
		title: React.PropTypes.node.isRequired,
	},

	displayName: 'NewButton',
	onClick: function (evt) {
		evt.preventDefault();

		History.pushSidebar(this.props.location, this.props.baseUrl);
	},

	render: function () {
		return (
			<Link to={this.props.baseUrl} className="item button-new" onClick={this.onClick}>
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
		
		displayName: 'TabLayout',
		getInitialState() {
			return {
				activeItem: null
			};
		},

		getUrl(id) {
			return this.props.itemUrl + '/' + id;
		},

		redirectTo(id) {
			History.replaceSidebar(this.props.location, this.getUrl(id));
		},

		saveLocation() {
			localStorage.setItem(this.props.baseUrl + '_last_active', this.props.activeId);
		},

		findItem(items, id) {
			return items.find(item => item.id == id); // Ignore the type because of local storage
		},

		componentWillReceiveProps(nextProps) {
			if (!nextProps.activeId) {
				return;
			}

			// All items removed?
			if (nextProps.items.length === 0) {
				this.reset();
				return;
			}

			// Update the active item
			const newActiveItem = this.findItem(nextProps.items, nextProps.activeId);
			if (newActiveItem) {
				this.setState({ activeItem: newActiveItem });
			}

			// After this, we only handle cases when the old tab has been closed
			const oldActiveId = this.props.activeId;
			if (nextProps.activeId !== oldActiveId) {
				// We have a new tab already
				return;
			}


			// Check if the current item still exists in the list
			if (this.findItem(nextProps.items, oldActiveId)) {
				return;
			}

			// Find the old position
			const oldItem = this.findItem(this.props.items, oldActiveId);
			const oldPos = this.props.items.indexOf(oldItem);

			let newItemPos = oldPos;
			if (oldPos === this.props.items.length-1) {
				// The last item was removed
				newItemPos = oldPos-1;
			}

			this.redirectTo(nextProps.items[newItemPos].id);
		},

		reset() {
			History.replaceSidebar(this.props.location, this.props.baseUrl);
			this.setState({ activeItem: null });
		},

		componentDidUpdate() {
			if (this.props.activeId) {
				this.saveLocation();
			}
		},

		componentWillMount() {
			if (this.props.activeId) {
				// Loading an item already
				const activeItem = this.findItem(this.props.items, this.props.activeId);
				if (activeItem) {
					this.setState({ activeItem: activeItem });
				} else if (this.props.location.action === 'POP') {
					// Browsing from history and item removed... go to "new" page
					this.reset();
				}

				this.saveLocation();
				return;
			}

			let lastId = localStorage.getItem(this.props.baseUrl + '_last_active');
			if (lastId && this.findItem(this.props.items, lastId)) {
				this.redirectTo(lastId);
			} else if (this.props.items.length > 0) {
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

			return (
				<Component 
					children={React.cloneElement(this.props.children, { item: this.state.activeItem })}
					newButton={<NewButton key="new-button" title={this.props.newButtonLabel} location={this.props.location} baseUrl={this.props.baseUrl} buttonClass={buttonClass}/>}
					menuItems={menuItems}
					location={this.props.location}
				/>
			);
		}
	});

	return SessionManagerDecorator;
}
