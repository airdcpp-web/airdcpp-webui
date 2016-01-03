'use strict';
import React from 'react';

import ListBrowser from './ListBrowser';
import FilelistFooter from './FilelistFooter';

import { RouteContext } from 'react-router';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';


const FilelistSession = React.createClass({
	mixins: [ RouteContext ],

	stateToString(state) {
		switch (state) {
			case 'download_pending': return 'Download pending';
			case 'downloading': return 'Downloading';
			case 'loading':
			default: return 'Loading';
		}
	},

	render() {
		const { user, location, state } = this.props.item;

		if (state.id !== 'loaded' || !location) {
			return <Loader text={ this.stateToString(state.id) }/>;
		}

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

				<FilelistFooter
					item={ this.props.item }
				/>
			</div>
		);
	},
});

export default FilelistSession;
