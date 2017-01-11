'use strict';
import React from 'react';

import Loader from 'components/semantic/Loader';
import SocketService from 'services/SocketService';
import ViewFileConstants from 'constants/ViewFileConstants';
import Message from 'components/semantic/Message';

import TextDecorator from 'components/TextDecorator';


const TextFile = React.createClass({
	componentWillMount() {
		if (this.props.item.content_ready) {
			this.fetchText(this.props.item);
		}
	},

	componentWillReceiveProps(nextProps) {
		if (!nextProps.item.content_ready) {
			return;
		}

		const idChanged = nextProps.item.id !== this.props.item.id;
		if (idChanged) {
			this.setState(this.getInitialState());
		}

		if (idChanged || !this.props.item.content_ready) {
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
		const { item } = this.props;
		const { text, error } = this.state;

		if (item.content_ready && !text) {
			if (error) {
				return (
					<Message
						title="Failed to fetch content"
						description={ error }
					/>
				);
			}

			return <Loader text="Preparing view"/>;
		}

		return (
			<pre>
				<TextDecorator
					text={ text }
				/>
			</pre>
		);
	},
});

export default TextFile;
