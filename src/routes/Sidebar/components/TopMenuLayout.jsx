import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import MenuIcon from 'components/menu/MenuIcon';


const SessionDropdown = ({ menuItems, newButton, sessionMenuStyle, unreadInfoStore }) => (
	<Dropdown triggerIcon={ <MenuIcon urgencies={ unreadInfoStore ? unreadInfoStore.getTotalUrgencies() : null } />}>
	 	<div className="header">New</div>
	 	{ newButton }
		<div className="ui divider" style={sessionMenuStyle}></div>
		<div className="header" style={sessionMenuStyle}>Current sessions</div>
		{ menuItems }
	</Dropdown>
);

const ItemHeader = ({ itemIconGetter, itemHeaderGetter, location, activeItem }) => (
	<div className="session-header">
		{ itemIconGetter(activeItem) }
		{ itemHeaderGetter(activeItem, location) }
	</div>
);

const CloseButton = ({ itemCloseHandler }) => (
	<a onClick={ itemCloseHandler } className="item close-button">
		<i className="grey remove icon"/>
		Close
	</a>
);

const TopMenuLayout = React.createClass({
	propTypes: {
		/**
		 * Location object
		 */
		location: React.PropTypes.object.isRequired,
	},

	render() {
		const { menuItems, activeItem } = this.props;

		// Don't add nesting for items to preserve Semantic"s CSS
		let sessionMenuStyle = {};
		if (menuItems.length === 0) {
			sessionMenuStyle = { display: 'none' };
		}

		//const content = activeItem ? this.props.children : <Loader/>;
		const content = this.props.children;
		return (
			<div className="session-container vertical">
				<div className="ui main menu menu-bar">
					<div className="content-left">
						<SessionDropdown sessionMenuStyle={ sessionMenuStyle } { ...this.props }/>
						{ activeItem ? <ItemHeader { ...this.props }/> : null }
					</div>
					{ activeItem ? <CloseButton { ...this.props }/> : null }
				</div>
				<div className="session-layout">
					{ content }
				</div>
			</div>
		);
	}
});

export default TopMenuLayout;
