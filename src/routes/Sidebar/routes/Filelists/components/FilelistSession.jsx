'use strict';
import React from 'react';

import ListBrowser from './ListBrowser';
import FilelistFooter from './FilelistFooter';

import ActiveSessionDecorator from 'decorators/ActiveSessionDecorator';

import { LocationContext } from 'mixins/RouterMixin';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';


const FilelistSession = React.createClass({
	mixins: [ LocationContext ],
	componentWillUpdate(nextProps, nextState) {
		if (this.props.session.state.id !== 'loaded' && nextProps.session.state.id === 'loaded') {
			this.props.actions.setRead(this.props.session.id);
		}
	},

	render() {
		const { user, location, state } = this.props.session;

		if (user.flags.indexOf('offline') !== -1 && user.flags.indexOf('me') === -1) {
			return (
				<Message 
					title="User offline"
					description="You will be able to continue browsing when the user comes back online"
				/>
			);
		}

		if ((state.id !== 'loaded' && state.id !== 'download_failed') || !location) {
			return <Loader text={ state.str }/>;
		}

		return (
			<div className="filelist-session">
				<ListBrowser
					{ ...this.props }
				/>

				<FilelistFooter
					session={ this.props.session }
				/>
			</div>
		);
	},
});

export default ActiveSessionDecorator(FilelistSession);
