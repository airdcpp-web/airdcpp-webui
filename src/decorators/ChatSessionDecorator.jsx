import React from 'react';
import Reflux from 'reflux';

export default function(Component, sessionStore, messageStore, actions) {
	const ChatSessionDecorator = React.createClass({
		propTypes: {
			/**
			 * Currently active tab (passed by TabLayout)
			 */
			item: React.PropTypes.any.isRequired
		},

		displayName: "ChatSessionDecorator",
		mixins: [Reflux.listenTo(messageStore, "onMessagesChanged")],

		onMessagesChanged(messages, id) {
			if (!this.props.item || id != this.props.item.id) { // NOTE: this should allow type conversion
				return;
			}

			this.setState({messages: messages});
		},

		getInitialState() {
			return {
				messages: []
			}
		},

		updateSession(id) {
			actions.sessionChanged(id);
			actions.setRead(id);

			actions.fetchMessages(id);
		},

		componentWillReceiveProps(nextProps) {
			if (!nextProps.item) {
				// Closing
				return;
			}

			if (!this.props.item || this.props.item.id != nextProps.item.id) {
				this.setState({ messages: [] });
				this.updateSession(nextProps.item.id);
			}
		},

		componentWillMount() {
			if (this.props.item) {
				this.updateSession(this.props.item.id);
			}
		},

		_onMessage(data) {
			const messages = React.addons.update(this.state.messages, {$push: [ { chat_message: data }]});
			this.setState({ messages: messages });
		},

		componentWillUnmount() {
			actions.sessionChanged(null);
		},

		handleClose() {
			actions.removeSession(this.props.item.id);
		},

		handleSend(message) {
			actions.sendMessage(this.props.item.id, message);
		},

		render() {
			if (!this.props.item) {
				return <div className="ui text loader">Loading</div>
			}

			return <Component {...this.props} {...this.state}/>
		},
	});

	return ChatSessionDecorator;
}