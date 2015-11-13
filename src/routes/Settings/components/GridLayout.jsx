'use strict';
import React from 'react';

import MenuItemLink from 'components/semantic/MenuItemLink';
import SettingPage from './SettingPage';

const GridLayout = React.createClass({
	sectionToUrl(section) {
		return '/settings/' + this.props.id + '/' + section;
	},

	getMenuItem(obj) {
		return (
			<MenuItemLink 
				key={ obj.url } 
				url={ this.sectionToUrl(obj.url) } 
				title={ obj.title }
			/>
		);
	},

	componentWillMount() {
		if (!this.props.children) {
			this.props.history.replaceState(null, this.sectionToUrl(this.props.menuItems[0].url));
		}
	},

	render() {
		let { children, menuItems } = this.props;

		const currentMenuItem = this.props.menuItems.find(item => this.sectionToUrl(item.url) === this.props.location.pathname);
		if (!currentMenuItem) {
			return null;
		}

		return (
			<div className={ 'ui segment grid settings-grid-layout ' + this.props.id }>
				<div className="three wide column menu-column">
					<div className="ui vertical secondary menu">
						{ menuItems.map(this.getMenuItem) }
					</div>
				</div>
				<div className="thirteen wide stretched column content-column">
					<div className="settings-content-column">
						<SettingPage 
							sectionId={ currentMenuItem.url } 
							title={ currentMenuItem.title }
							icon={ this.props.icon }
						>
							{ children }
						</SettingPage>
					</div>
				</div>
			</div>
		);
	},
});

export default GridLayout;
