'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import { getIconMenuItem } from './MenuItem';
import History from 'utils/History';
import LoginActions from 'actions/LoginActions';

import TransferStats from 'components/TransferStats';
import PerformanceTools from './PerformanceTools';
import TouchIcon from './TouchIcon';


const LogoutItem = { 
	icon: 'sign out', 
	url: 'logout', 
	title: 'Logout',
	className: 'logout', 
};

const MobileMenu = React.createClass({
	contextTypes: {
		history: React.PropTypes.object.isRequired
	},
	
	componentDidMount() {
		const settings = {
			context: '#mobile-layout',
			transition: 'overlay',
			mobileTransition: 'overlay',
			onHidden: this.props.onClose,
		};

		let dom = ReactDOM.findDOMNode(this);
		$(dom).sidebar(settings).sidebar('show');
	},

	onClickSecondary(url, evt) {
		evt.preventDefault();

		if (!this.context.history.isActive(url)) {
			History.pushSidebar(this.props.location, url);
		}

		this.onClick(url, evt);
	},

	onClick(url, evt) {
		let dom = ReactDOM.findDOMNode(this);
		$(dom).sidebar('hide');
	},

	logout(e) {
		LoginActions.logout();
	},

	render() {
		const { secondaryMenuItems, mainMenuItems } = this.props;
		return (
			<div id="mobile-menu" className="ui right vertical inverted sidebar menu">
				{ mainMenuItems.map(getIconMenuItem.bind(this, this.onClick)) }
				<div className="divider"></div>
				{ secondaryMenuItems.map(getIconMenuItem.bind(this, this.onClickSecondary)) }
				{ getIconMenuItem(this.logout, LogoutItem) }
				<div className="actions">
					<TransferStats className="ui centered inverted mini list"/>
					<TouchIcon/>
					{ process.env.NODE_ENV !== 'production' ? <PerformanceTools/> : null }
				</div>
			</div>
		);
	},
});

export default MobileMenu;
