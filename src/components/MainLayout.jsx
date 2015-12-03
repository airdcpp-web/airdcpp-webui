import React from 'react';

import NavigationPanel from './menu/Navigation';
import SideMenu from './menu/SideMenu';

import { SIDEBAR_ID } from 'constants/OverlayConstants';

import HubActions from 'actions/HubActions';
import PrivateChatActions from 'actions/PrivateChatActions';
import FilelistActions from 'actions/FilelistActions';
import LogActions from 'actions/LogActions';


const showSideBar = (props) => {
	return props.location.state &&
		props.location.state[SIDEBAR_ID];
};

const MainLayout = React.createClass({
	showSideBar(props) {
		return props.location.state &&
			props.location.state[SIDEBAR_ID];
	},

	componentWillMount() {
		PrivateChatActions.fetchSessions();
		HubActions.fetchSessions();
		FilelistActions.fetchSessions();

		LogActions.fetchMessages();
	},

	componentWillReceiveProps(nextProps) {
		if (showSideBar(nextProps)) {
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
		if (showSideBar(this.props)) {
			sidebar = React.cloneElement(this.props.children, { overlayId: SIDEBAR_ID });
		}

		return (
			<div className={this.props.className} id={this.props.id}>
				{ sidebar }
				<div className="pusher">
					<NavigationPanel location={this.props.location}/>
					<div className="ui container main">
						{sidebar ?
							this.previousChildren :
							this.props.children
						}
					</div>
				</div>
				<SideMenu id="side-menu" location={ this.props.location }/>
			</div>
		);
	}
});

export default MainLayout;