import React from 'react';

import SessionManagerDecorator from 'routes/Sidebar/decorators/SessionManagerDecorator'

const SideMenuLayout = React.createClass({
	propTypes: {
		/**
		 * Location object
		 */
		location: React.PropTypes.object.isRequired,
	},

	displayName: "SideMenuLayout",
	render() {
		return (
			<div className="ui grid side-menu-layout">
				<div className="four wide column">
					<div className="ui vertical fluid tabular menu">
						{ this.props.newButton }
						{ this.props.menuItems }
					</div>
				</div>
				<div className="twelve wide stretched column">
					<div className="ui segment session-layout">
						{ this.props.children }
					</div>
				</div>
			</div>
	);
	}
});

export default SessionManagerDecorator(SideMenuLayout, "ui fluid button");