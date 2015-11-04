import React from 'react';

import SessionManagerDecorator from 'routes/Sidebar/decorators/SessionManagerDecorator';

const SideMenuLayout = React.createClass({
	propTypes: {
		/**
		 * Location object
		 */
		location: React.PropTypes.object.isRequired,
	},

	displayName: 'SideMenuLayout',
	render() {
		return (
			<div className="ui grid side-menu-layout">
				<div className="four wide column menu-column">
					{ this.props.newButton }
					{ (this.props.menuItems.length ? 
						<div className="ui vertical menu">
							{ this.props.menuItems }
						</div> : null)
					}
				</div>
				<div className="twelve wide stretched column content-column">
					<div className="ui segment session-layout">
						{ this.props.children }
					</div>
				</div>
			</div>
	);
	}
});

export default SessionManagerDecorator(SideMenuLayout, 'ui fluid button');
