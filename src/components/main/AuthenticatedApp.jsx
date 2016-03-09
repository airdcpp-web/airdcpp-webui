'use strict';
import React from 'react';
import Reflux from 'reflux';
import invariant from 'invariant';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';
import AccessConstants from 'constants/AccessConstants';

import ActivityTracker from './ActivityTracker';
import Notifications from './Notifications';
import BrowserUtils from 'utils/BrowserUtils';

import MobileLayout from './MobileLayout';
import MainLayout from './MainLayout';

import SocketConnectStatus from './SocketConnectStatus';
import SetContainerSize from 'mixins/SetContainerSize';

import ModalHandlerDecorator from 'decorators/main/ModalHandlerDecorator';

import HubActions from 'actions/HubActions';
import PrivateChatActions from 'actions/PrivateChatActions';
import FilelistActions from 'actions/FilelistActions';
import ViewFileActions from 'actions/ViewFileActions';
import EventActions from 'actions/EventActions';
import SystemActions from 'actions/SystemActions';

import OverlayConstants from 'constants/OverlayConstants';


const showSideBar = (props) => {
	return props.location.state &&
		props.location.state[OverlayConstants.SIDEBAR_ID];
};

const AuthenticatedApp = React.createClass({
	mixins: [ Reflux.connect(LoginStore, 'login'), SetContainerSize ],
	contextTypes: {
		router: React.PropTypes.object
	},

	updateTitle() {
		let title = 'AirDC++ Web Client';
		if (LoginStore.systemInfo) {
			title = LoginStore.systemInfo.hostname + ' - ' + title;
		}

		document.title = title;
	},

	onSocketAuthenticated() {
		if (LoginStore.hasAccess(AccessConstants.PRIVATE_CHAT_VIEW)) {
			PrivateChatActions.fetchSessions();
		}

		if (LoginStore.hasAccess(AccessConstants.HUBS_VIEW)) {
			HubActions.fetchSessions();
		}

		if (LoginStore.hasAccess(AccessConstants.FILELISTS_VIEW)) {
			FilelistActions.fetchSessions();
		}

		if (LoginStore.hasAccess(AccessConstants.VIEW_FILE_VIEW)) {
			ViewFileActions.fetchSessions();
		}

		if (LoginStore.hasAccess(AccessConstants.EVENTS_VIEW)) {
			EventActions.fetchInfo();
		}

		SystemActions.fetchAway();

		this.updateTitle();
	},

	componentWillMount() {
		if (this.state.login.socketAuthenticated) {
			this.onSocketAuthenticated();
		}

		if (showSideBar(this.props)) {
			this.previousChildren = <div/>;
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
		if (nextState.login.userLoggedIn && this.state.login.socketAuthenticated && !nextState.login.socketAuthenticated) {
			// Reconnect (but not too fast)
			console.log('UI: Socket closed, attempting to reconnect in 2 seconds');
			setTimeout(() => LoginActions.connect(this.state.login.token), 2000);
		} else if (this.state.login.userLoggedIn && !nextState.login.userLoggedIn) {
			// Go to the login page as we don't have a valid session anymore
			// Return to this page if the session was lost (instead of having logged out) 

			console.log('UI: Redirecting to login page');
			this.context.router.replace({
				state: LoginStore.lastError !== null ? { nextPath: this.props.location.pathname } : null, 
				pathname: '/login',
			});

			this.updateTitle();
		} else if (!this.state.login.socketAuthenticated && nextState.login.socketAuthenticated) {
			this.onSocketAuthenticated();
		}
	},

	render() {
		invariant(this.props.children, 'AuthenticatedApp should always have children');
		if (!this.state.login.socketAuthenticated) {
			// Dim the screen until the server can be reached (we can't do anything without the socket)
			return <SocketConnectStatus active={true} lastError={this.state.login.lastError}/>;
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
				<ActivityTracker/>
				<Notifications location={ this.props.location }/>
				<LayoutElement className="pushable main-layout" sidebar={ sidebar } { ...this.props }>
					{ this.previousChildren ? this.previousChildren : this.props.children }
				</LayoutElement>
			</div>
		);
	}
});

export default ModalHandlerDecorator(AuthenticatedApp);
