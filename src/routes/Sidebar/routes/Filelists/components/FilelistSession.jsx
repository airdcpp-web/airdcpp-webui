'use strict';

import React from 'react';

import ListBrowser from './ListBrowser';

import { RouteContext } from 'react-router';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';

const FilelistSession = React.createClass({
	mixins: [ RouteContext ],

	stateToString(state) {
		switch (state) {
			case 'download_pending': return 'Download pending';
			case 'downloading': return 'Downloading';
			case 'loading': return 'Loading';
			default: return 'Loaded';
		}
	},

	render() {
		const state = this.props.item.state.id;

		if (state !== 'loaded') {
			return <Loader text={ this.stateToString(state) }/>;
		}

		const { user } = this.props.item;
		if (user.flags.indexOf('offline') !== -1) {
			return (
				<Message 
					title="User offline"
					description="You will be able to continue browsing when the user comes back online"
				/>
			);
		}

		return (
			<div className="filelist-session">
				<ListBrowser
					{ ...this.props }
				/>
			</div>
		);
	},
});

export default FilelistSession;
