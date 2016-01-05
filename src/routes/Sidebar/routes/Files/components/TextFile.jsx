'use strict';
import React from 'react';

import Loader from 'components/semantic/Loader';
import SocketService from 'services/SocketService';
import ViewFileConstants from 'constants/ViewFileConstants';
import Message from 'components/semantic/Message';

import Linkify from 'react-linkify';


const TextFile = React.createClass({
	componentWillMount() {
		if (this.props.item.state.id === 'downloaded') {
			this.fetchText(this.props.item);
		}
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.item.state.id !== 'downloaded') {
			return;
		}

		const idChanged = nextProps.item.id !== this.props.item.id;
		if (idChanged) {
			this.setState(this.getInitialState());
		}

		if (idChanged || this.props.item.state.id !== 'downloaded') {
			this.fetchText(nextProps.item);
		}
	},

	getInitialState() {
		return {
			text: null,
			error: null,
		};
	},

	fetchText(item) {
		SocketService.get(ViewFileConstants.SESSION_URL + '/' + item.id + '/text')
			.then(this.onTextReceive)
			.catch(this.onTextFailed);
	},

	onTextFailed(error) {
		this.setState({ 
			error: error.message,
		});
	},

	onTextReceive(data) {
		this.setState({ 
			text: data.text,
		});
	},

	render() {
		const { state } = this.props.item;
		if (state.id === 'downloaded' && !this.state.text) {
			if (this.state.error) {
				return (
					<Message
						title="Failed to fetch content"
						description={ this.state.error }
					/>
				);
			}

			return <Loader text="Preparing view"/>;
		}

		return (
			<pre>
				<Linkify properties={{ target: '_blank' }}>
					{ this.state.text }
				</Linkify>
			</pre>
		);
	},
});

export default TextFile;
