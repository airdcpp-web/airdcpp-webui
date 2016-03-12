'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import Dropdown from 'components/semantic/Dropdown';
import MainNavigationDecorator from 'decorators/menu/MainNavigationDecorator';
import { getIconMenuItem } from 'components/menu/MenuItem';

import History from 'utils/History';
import IconPanel from './IconPanel';


const MainNavigationMobile = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
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

		if (!this.context.router.isActive(url)) {
			History.pushSidebar(this.props.location, url);
		}

		this.onClick(url, evt);
	},

	onClick(url, evt) {
		let dom = ReactDOM.findDOMNode(this);
		$(dom).sidebar('hide');
	},

	render() {
		const { configMenuItems, mainMenuItems, secondaryMenuItems, logoutItem } = this.props;
		const moreCaption = (
			<div>
				<i className="ellipsis horizontal caption icon"></i>
				More...
			</div>
		);

		return (
			<div id="mobile-menu" className="ui left vertical inverted sidebar menu">
				{ mainMenuItems.map(getIconMenuItem.bind(this, this.onClick)) }
				<Dropdown caption={ moreCaption } triggerIcon="">
					{ configMenuItems.map(getIconMenuItem.bind(this, this.onClick)) }
					<div className="divider"></div>
					{ getIconMenuItem(logoutItem.onClick, logoutItem) }
				</Dropdown>

				<div className="separator"></div>

				{ secondaryMenuItems.map(getIconMenuItem.bind(this, this.onClickSecondary)) }
				<IconPanel/>
			</div>
		);
	},
});

export default MainNavigationDecorator(MainNavigationMobile);
