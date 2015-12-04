import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
//import Loader from 'components/semantic/Loader';


const SessionDropdown = ({ menuItems, newButton, sessionMenuStyle }) => (
	<Dropdown triggerIcon="content">
	 	<div className="header">New</div>
	 	{ newButton }
		<div className="ui divider" style={sessionMenuStyle}></div>
		<div className="header" style={sessionMenuStyle}>Existing</div>
		{ menuItems }
	</Dropdown>
);

const TopMenuLayout = React.createClass({
	propTypes: {
		/**
		 * Location object
		 */
		location: React.PropTypes.object.isRequired,
	},

	render() {
		const { activeItem, menuItems, itemIconGetter, itemHeaderGetter, itemCloseHandler, location } = this.props;

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
					<SessionDropdown sessionMenuStyle={ sessionMenuStyle } { ...this.props }/>
					<div className="session-header">
						{ itemIconGetter(activeItem) }
						{ itemHeaderGetter(activeItem, location) }
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
