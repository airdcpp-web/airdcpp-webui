import React from 'react';

import MainNavigation from 'components/main/navigation/MainNavigationNormal';
import SideMenu from 'components/main/navigation/SideMenu';
import SiteHeader from './SiteHeader';

import 'normal.css';

const { PropTypes } = React;

const MainLayout = React.createClass({
	propTypes: {
		children: PropTypes.object.isRequired,
		sidebar: PropTypes.object,
		location: PropTypes.object.isRequired,
	},

	render() {
		const { children, sidebar } = this.props;

		return (
			<div className={ this.props.className + ' sidebar-context' } id="normal-layout">
				{ sidebar }
				<div className="pusher">
					<SiteHeader 
						content={ <MainNavigation/> }
					/>
					<div className="ui site-content">
						{ children }
					</div>
				</div>
				<SideMenu location={ this.props.location }/>
			</div>
		);
	}
});

export default MainLayout;