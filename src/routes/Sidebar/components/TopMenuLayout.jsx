import React from 'react';

import SessionManagerDecorator from 'routes/Sidebar/decorators/SessionManagerDecorator'
import Dropdown from 'components/semantic/Dropdown'

const TopMenuLayout = React.createClass({
	propTypes: {
		/**
		 * Location object
		 */
		location: React.PropTypes.object.isRequired,
	},

	displayName: "TopMenuLayout",
	render() {
		// Don't add nesting for items to preserve Semantic's CSS
		let sessionMenuStyle = {};
		if (this.props.menuItems.length === 0) {
			sessionMenuStyle = { display: "none" }
		}

		return (
			<div className="top-menu-layout">
				<div className="ui main menu menu-bar">
					<Dropdown icon="content">
					 	<div className="header">New</div>
					 	{ this.props.newButton }
						<div className="ui divider" style={sessionMenuStyle}></div>
						<div className="header" style={sessionMenuStyle}>Existing</div>
						{ this.props.menuItems }
					</Dropdown>
				</div>
				<div className="session-layout">
					{ this.props.children }
				</div>
			</div>
		);
	}
});

export default SessionManagerDecorator(TopMenuLayout);