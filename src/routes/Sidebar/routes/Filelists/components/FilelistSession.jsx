'use strict';

import React from 'react';

import ListBrowser from './ListBrowser';

import { RouteContext } from 'react-router';

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
		return (
			<div className="filelist-session">
				{ ((state !== 'loaded') ? 
					(<div className="ui active text loader">{ this.stateToString(state) }</div>)
				: (
					<ListBrowser
						{ ...this.props }
					/>
				))}
			</div>
		);
	},
});

export default FilelistSession;
