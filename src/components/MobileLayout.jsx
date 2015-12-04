import React from 'react';

import SiteHeader from './SiteHeader';
import MobileMenu from './menu/MobileMenu';

import MainLayoutDecorator from 'decorators/MainLayoutDecorator';

import '../mobile.css';


const MobileLayout = React.createClass({
	getInitialState() {
		return {
			menuVisible: false,
		};
	},

	onClickMenu() {
		this.setState({ menuVisible: !this.state.menuVisible });
	},

	render() {
		const { mainContent, sidebar, secondaryMenuItems, mainMenuItems } = this.props;
		
		return (
			<div className={this.props.className} id="mobile-layout">
				{ this.state.menuVisible ? (
					<MobileMenu
						location={ this.props.location }
						secondaryMenuItems={ secondaryMenuItems } 
						mainMenuItems={ mainMenuItems }
						onClose={ this.onClickMenu }
					/>
				) : null }
				<div className="pusher" id="mobile-layout-inner">
					<SiteHeader 
						content={
							<div className="item right">
								<i className="content link icon" onClick={this.onClickMenu}></i>
							</div>
						}
					/>
					{ sidebar }
					<div className="ui site-content pusher">
						{ mainContent }
					</div>
				</div>
			</div>
		);
	}
});

export default MainLayoutDecorator(MobileLayout, '#mobile-layout-inner');