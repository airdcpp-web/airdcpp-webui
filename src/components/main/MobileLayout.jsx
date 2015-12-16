import React from 'react';

import SiteHeader from './SiteHeader';
import MobileMenu from 'components/menu/MobileMenu';
import MenuIcon from 'components/menu/MenuIcon';

import UrgencyUtils from 'utils/UrgencyUtils';
import History from 'utils/History';
import Button from 'components/semantic/Button';
import MainNavigationDecorator from 'decorators/MainNavigationDecorator';

import 'mobile.css';


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

const HeaderContent = MainNavigationDecorator(({ secondaryMenuItems, onClickMenu, onClickBack, sidebar }) => (
	<div className="right">
		{ sidebar ? 
			<Button 
				className="item" 
				caption="Back" 
				icon="blue angle left"
				onClick={ onClickBack }
			/> : null }
		<MenuIcon 
			urgencies={ secondaryMenuItems.reduce(reduceItemUrgency, {}) }
			onClick={ onClickMenu }
			className="item"
		/>
	</div>
));

const MobileLayout = React.createClass({
	getInitialState() {
		return {
			menuVisible: false,
		};
	},

	onClickMenu() {
		this.setState({ menuVisible: !this.state.menuVisible });
	},

	onClickBack() {
		History.replaceSidebarData(this.props.location, { close: true });
	},

	render() {
		const { children, sidebar, secondaryMenuItems, mainMenuItems } = this.props;
		
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
				<div className="pusher sidebar-context" id="mobile-layout-inner">
					<SiteHeader 
						content={
							<HeaderContent
								onClickMenu={ this.onClickMenu }
								onClickBack={ this.onClickBack }
								secondaryMenuItems={ secondaryMenuItems }
								sidebar={ sidebar }
							/>
						}
					/>
					{ sidebar }
					<div className="ui site-content pusher">
						{ children }
					</div>
				</div>
			</div>
		);
	}
});

export default MobileLayout;