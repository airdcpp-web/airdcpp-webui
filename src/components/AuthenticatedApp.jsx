'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import Reflux from 'reflux';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';

import Notifications from './Notifications';
import Loader from 'components/semantic/Loader';

import NavigationPanel from './Navigation';
import SideMenu from './SideMenu';

import { SIDEBAR_ID } from 'constants/OverlayConstants';

import { History, RouteContext } from 'react-router';

const SocketConnectStatus = React.createClass({
	render() {
		let message;
		if (this.props.lastError !== null) {
			message = this.props.lastError + '. Reconnecting...';
		} else {
			message = 'Connecting to the server...';
		}

		return (
			<div className={ 'ui dimmer page visible ' + (this.props.active ? 'active' : '')}>
				<div className="content">
					<div className="center">
						<Loader text={message}/>
					</div>
				</div>
			</div>
		);
	}
});

let MainLayout = React.createClass({
	showSideBar(props) {
		return props.location.state &&
			props.location.state[SIDEBAR_ID];
	},

	componentWillReceiveProps(nextProps) {
		if (this.showSideBar(nextProps)) {
			if (!this.previousChildren) {
				// save the old children (just like animation)
				this.previousChildren = this.props.children;
			}
		} else {
			this.previousChildren = null;
		}
	},

	render() {
		let sidebar = null;
		if (this.showSideBar(this.props)) {
			sidebar = React.cloneElement(this.props.children, { overlayId: SIDEBAR_ID });
		}

		return (
			<div className={this.props.className} id={this.props.id}>
					{ sidebar }
				<div className="pusher">
					<NavigationPanel/>
					<div className="ui container main">
						{sidebar ?
							this.previousChildren :
							this.props.children
						}
					</div>
				</div>
			</div>
		);
	}
});

let nodes = {};

const removeNode = (key) => {
	let node = nodes[key];
	if (node) {
		ReactDOM.unmountComponentAtNode(node);
		document.body.removeChild(node);
		delete nodes[key];
	}
};

const getLastChildren = (currentChild) => {
	if (currentChild.props.children) {
		return getLastChildren(currentChild.props.children);
	}

	return currentChild;
};

const AuthenticatedApp = React.createClass({
	mixins: [ Reflux.connect(LoginStore), History, RouteContext ],

	getOverlay(key, props) {
		// Causes more bugs when this is enabled, think something better later
		// It can still mess up the history when quickly going back and forward
		//if (closing)
		//	return null;

		const { state } = props.location;
		const modalComponent = getLastChildren(props.children);
		const ret = React.cloneElement(modalComponent, { 
			onHidden: () => {
				removeNode(key);
			},

			overlayId: key,

			// Pass the location data as props
			// Note: isRequired can't be used in proptypes because of cloneElement
			...state[key].data
		});

		return ret;
	},

	createModal(key, props) {
		let node = document.createElement('div');
		nodes[key] = node;

		document.body.appendChild(node);
		ReactDOM.render(this.getOverlay(key, props), node);
	},

	checkModals(props) {
		if (!props.location.state) {
			return false;
		}

		let hasModals = false;

		// Check all modal entries that don't exist in current props
		Object.keys(props.location.state).forEach(key => {
			if (key.indexOf('modal_') === 0) {
				if (!this.props.location.state || !this.props.location.state[key]) {
					this.createModal(key, props);
				}

				hasModals = true;
			}
		});

		return hasModals;
	},

	componentWillReceiveProps(nextProps) {
		if (this.checkModals(nextProps)) {
			if (!this.previousChildren) {
				// save the old children (just like animation)
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
			// Logged out
			this.history.replaceState(null, '/login');
		}
	},

	render() {
		if (this.state.socketAuthenticated) {
			return (
				<div id="authenticated-app">
					<Notifications location={ this.props.location }/>
					<SideMenu id="side-menu" location={ this.props.location }/>
					<MainLayout id="main-layout" className="pushable" location={ this.props.location }>
						{ this.previousChildren ?
							this.previousChildren :
							this.props.children
						}
					</MainLayout>
				</div>
			);
		} else {
			// Dim the screen until the server can be reached (we can't do anything without the socket)
			return(
				<SocketConnectStatus active={true} lastError={this.state.lastError}/>
			);
		}
	}
});

export default AuthenticatedApp;
