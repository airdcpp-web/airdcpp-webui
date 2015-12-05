import React from 'react';

import SiteHeader from './SiteHeader';
import MobileMenu from './menu/MobileMenu';
import MenuIcon from './menu/MenuIcon';

import MainLayoutDecorator from 'decorators/MainLayoutDecorator';
import UrgencyUtils from 'utils/UrgencyUtils';

import '../mobile.css';


const reduceItemUrgency = (map, menuItem) => {
	if (menuItem.unreadInfoStore) {
		const urgencies = menuItem.unreadInfoStore.getTotalUrgencies();
		const max = UrgencyUtils.maxUrgency(urgencies);
		if (max) {
			UrgencyUtils.appendToMap(map, max);
		}
	}

	return map;
};

const Menu = ({ secondaryMenuItems, onClick }) => (
	<div className="item right">
		<MenuIcon 
			urgencies={ secondaryMenuItems.reduce(reduceItemUrgency, {}) }
			onClick={ onClick }
		/>
	</div>
);

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
							<Menu
								onClick={this.onClickMenu}
								secondaryMenuItems={ secondaryMenuItems } 
							/>
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