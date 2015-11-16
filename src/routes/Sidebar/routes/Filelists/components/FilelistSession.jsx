'use strict';

import React from 'react';

import ListBrowser from './ListBrowser';

import FilelistActions from 'actions/FilelistActions';
import Format from 'utils/Format';

import { UserMenu } from 'components/Menu';
import TabHeader from 'routes/Sidebar/components/TabHeader';

import { RouteContext } from 'react-router';

const FilelistSession = React.createClass({
	mixins: [ RouteContext ],
	handleClose() {
		FilelistActions.removeSession(this.props.item.id);
	},

	stateToString(state) {
		switch (state) {
			case 'download_pending': return 'Download pending';
			case 'downloading': return 'Downloading';
			case 'loading': return 'Loading';
			default: return 'Loaded';
		}
	},

	render() {
		if (!this.props.item) {
			return <div className="ui text loader">Loading</div>;
		}
		
		const { user } = this.props.item;
		const userMenu = (
			<UserMenu 
				location={this.props.location}
				user={ user } 
				ids={[ 'message' ]}
			/>
		);

		const icon = (
			<Format.UserIconFormatter size="large" flags={user.flags} />
		);

		const state = this.props.item.state.id;
		return (
			<div className="filelist-session">
				<TabHeader
					icon={icon}
					title={userMenu}
					buttonClickHandler={this.handleClose}
					subHeader={ user.hub_names }
				/>

				{ ((state !== 'loaded') ? 
					(<div className="ui active text loader">{ this.stateToString(state) }</div>)
				: (
					<ListBrowser
						location={this.props.location}
						item={this.props.item}
					/>
				))}
			</div>
		);
	},
});

export default FilelistSession;
