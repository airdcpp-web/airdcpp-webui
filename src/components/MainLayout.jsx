import React from 'react';

import NavigationPanel from './menu/Navigation';
import SideMenu from './menu/SideMenu';
import SiteHeader from './SiteHeader';

import '../normal.css';


const MainLayout = React.createClass({
	render() {
		const { mainContent, sidebar, mainMenuItems, secondaryMenuItems } = this.props;

		return (
			<div className={ this.props.className + ' sidebar-context' } id="normal-layout">
				{ sidebar }
				<div className="pusher">
					<SiteHeader 
						content={ 
							<NavigationPanel
								secondaryMenuItems={ secondaryMenuItems } 
								mainMenuItems={ mainMenuItems }
							/>
						}
					/>
					<div className="ui site-content">
						{ mainContent }
					</div>
				</div>
				<SideMenu location={ this.props.location } sidebarItems={this.props.secondaryMenuItems}/>
			</div>
		);
	}
});

export default MainLayout;