'use strict';
import React from 'react';
import Reflux from 'reflux';
import invariant from 'invariant';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';

import Notifications from './Notifications';
import BrowserUtils from 'utils/BrowserUtils';

import MobileLayout from './MobileLayout';
import MainLayout from './MainLayout';

import { History, RouteContext } from 'react-router';
import SocketConnectStatus from './SocketConnectStatus';
import SetContainerSize from 'mixins/SetContainerSize';

import ModalHandlerDecorator from 'decorators/ModalHandlerDecorator';

import HubActions from 'actions/HubActions';
import PrivateChatActions from 'actions/PrivateChatActions';
import FilelistActions from 'actions/FilelistActions';
import LogActions from 'actions/LogActions';

import OverlayConstants from 'constants/OverlayConstants';


const showSideBar = (props) => {
	return props.location.state &&
		props.location.state[OverlayConstants.SIDEBAR_ID];
};

const AuthenticatedApp = React.createClass({
	mixins: [ Reflux.connect(LoginStore), History, RouteContext, SetContainerSize ],

	initContent() {
		PrivateChatActions.fetchSessions();
		HubActions.fetchSessions();
		FilelistActions.fetchSessions();

		LogActions.fetchMessages();
	},

	componentWillMount() {
		if (this.state.socketAuthenticated) {
			this.initContent();
		}
	},

	componentWillReceiveProps(nextProps) {
		if (showSideBar(nextProps)) {
			if (!this.previousChildren) {
				this.previousChildren = this.props.children;
			}
		} else {
			this.previousChildren = null;
		}
	},

	componentWillUpdate(nextProps, nextState) {
		if (nextState.userLoggedIn && this.state.socketAuthenticated && !nextState.socketAuthenticated) {
			// Reconnect (but not too fast)
			console.log('Socket closed, attempting to reconnect in 2 seconds');
			setTimeout(() => LoginActions.connect(this.state.token), 2000);
		} else if (this.state.userLoggedIn && !nextState.userLoggedIn) {
			// Go to the login page as we don't have a valid session anymore
			// Return to this page if the session was lost (instead of having logged out) 
			//this.history.replace({
			//	state: LoginStore.lastError !== null ? { nextPath: this.props.location.pathname } : null, 
			//	pathname: '/login',
			//});

			this.history.replaceState(
				LoginStore.lastError !== null ? { nextPath: this.props.location.pathname } : null, 
				'/login'
			);
		} else if (!this.state.socketAuthenticated && nextState.socketAuthenticated) {
			this.initContent();
		}
	},

	render() {
		invariant(this.props.children, 'AuthenticatedApp should always have children');
		if (!this.state.socketAuthenticated) {
			// Dim the screen until the server can be reached (we can't do anything without the socket)
			return <SocketConnectStatus active={true} lastError={this.state.lastError}/>;
		}


		let sidebar = null;
		if (showSideBar(this.props)) {
			sidebar = React.cloneElement(this.props.children, { 
				overlayId: OverlayConstants.SIDEBAR_ID,
				overlayContext: '.sidebar-context',
			});
		}

		const LayoutElement = BrowserUtils.useMobileLayout() ? MobileLayout : MainLayout;
		return (
			<div id="authenticated-app">
				<Notifications location={ this.props.location }/>
				<LayoutElement className="pushable main-layout" sidebar={ sidebar } { ...this.props }>
					{ this.previousChildren ? this.previousChildren : this.props.children }
				</LayoutElement>
			</div>
		);
	}
});

export default ModalHandlerDecorator(AuthenticatedApp);
