import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import MenuIcon from 'components/menu/MenuIcon';


const SessionDropdown = ({ menuItems, newButton, unreadInfoStore }) => {
	// Don't add nesting for items to preserve Semantic"s CSS
	// There should always be something to show if we are rendering the menu
	const hideStyle = { display: 'none' };
	const sessionMenuStyle = menuItems.length === 0 ? hideStyle : null;

	return (
		<Dropdown triggerIcon={ <MenuIcon urgencies={ unreadInfoStore ? unreadInfoStore.getTotalUrgencies() : null } />}>
		 	<div className="header" style={ newButton ? null : hideStyle }>New</div>
		 	{ newButton }
			<div className="ui divider" style={sessionMenuStyle}></div>
			<div className="header" style={sessionMenuStyle}>Current sessions</div>
			{ menuItems }
		</Dropdown>
	);
};

const ItemHeader = ({ itemIcon, itemHeader, location, activeItem, actionMenu }) => (
	<div className="session-header">
		{ itemIcon }
		{ itemHeader }
	</div>
);

const TopMenuLayout = React.createClass({
	propTypes: {
		/**
		 * Location object
		 */
		location: React.PropTypes.object.isRequired,
	},

	render() {
		const content = this.props.children;
		return (
			<div className="session-container vertical">
				<div className="ui main menu menu-bar">
					<div className="content-left">
						<SessionDropdown { ...this.props }/>
						{ this.props.activeItem ? <ItemHeader { ...this.props }/> : null }
					</div>
				</div>
				<div className="session-layout">
					{ content }
				</div>
			</div>
		);
	}
});

export default TopMenuLayout;
