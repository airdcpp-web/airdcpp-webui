import React from 'react';

import SiteHeader from './SiteHeader';
import MainNavigation from 'components/main/navigation/MainNavigationMobile';
import MenuIcon from 'components/menu/MenuIcon';

import UrgencyUtils from 'utils/UrgencyUtils';
import History from 'utils/History';
import Button from 'components/semantic/Button';
import MainNavigationDecorator from 'decorators/menu/MainNavigationDecorator';

import 'mobile.css';


const reduceItemUrgency = (map, menuItem) => {
	if (!menuItem.unreadInfoStore) {
		return map;
	}

	const urgencies = menuItem.unreadInfoStore.getTotalUrgencies();
	if (!urgencies) {
		return map;
	}

	const max = UrgencyUtils.maxUrgency(urgencies);
	if (max) {
		UrgencyUtils.appendToMap(map, max);
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

const MainLayoutMobile = React.createClass({
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
		const { children, sidebar } = this.props;
		
		return (
			<div className={this.props.className} id="mobile-layout">
				{ this.state.menuVisible ? (
					<MainNavigation
						location={ this.props.location }
						onClose={ this.onClickMenu }
					/>
				) : null }
				<div className="pusher sidebar-context" id="mobile-layout-inner">
					<SiteHeader 
						content={
							<HeaderContent
								onClickMenu={ this.onClickMenu }
								onClickBack={ this.onClickBack }
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

export default MainLayoutMobile;