'use strict';
import React from 'react';
import Reflux from 'reflux';

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
import MainLayoutDecorator from 'decorators/MainLayoutDecorator';

import HubActions from 'actions/HubActions';
import PrivateChatActions from 'actions/PrivateChatActions';
import FilelistActions from 'actions/FilelistActions';
import LogActions from 'actions/LogActions';


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

	componentWillUpdate(nextProps, nextState) {
		if (nextState.userLoggedIn && this.state.socketAuthenticated && !nextState.socketAuthenticated) {
			// Reconnect (but not too fast)
			console.log('Socket closed, attempting to reconnect in 2 seconds');
			setTimeout(() => LoginActions.connect(this.state.token), 2000);
		} else if (this.state.userLoggedIn && !nextState.userLoggedIn) {
			// Go to the login page as we don't have a valid session anymore
			// Return to this page if the session was lost (instead of having logged out) 
			this.history.replaceState(LoginStore.lastError !== null ? { nextPath: this.props.location.pathname } : null, '/login');
		} else if (!this.state.socketAuthenticated && nextState.socketAuthenticated) {
			this.initContent();
		}
	},

	render() {
		const LayoutElement = BrowserUtils.useMobileLayout() ? MobileLayout : MainLayout;
		if (this.state.socketAuthenticated) {
			return (
				<div id="authenticated-app">
					<Notifications location={ this.props.location }/>
					<LayoutElement className="pushable main-layout" { ...this.props }>
						{ this.props.children }
					</LayoutElement>
				</div>
			);
		} else {
			// Dim the screen until the server can be reached (we can't do anything without the socket)
			return <SocketConnectStatus active={true} lastError={this.state.lastError}/>;
		}
	}
});

export default MainLayoutDecorator(ModalHandlerDecorator(AuthenticatedApp));
