import React from 'react';
import ReactDOM from 'react-dom';

export default function (Component) {
	let shouldScrollBottom = false;

	const ScrollDecorator = React.createClass({
		propTypes: {
			/**
			 * The container will always be scrolled to bottom if the session changes
			 */
			session: React.PropTypes.any,
		},

		componentDidMount: function () {
			this._scrollToBottom();
		},

		componentWillUpdate: function (nextProps, nextState) {
			if (nextProps.session && nextProps.session.id !== this.props.session.id) {
				shouldScrollBottom = true;
				return;
			}

			let node = ReactDOM.findDOMNode(this.refs.scrollableContainer);
			if (!node) {
				shouldScrollBottom = false;
				return;
			}

			const offSetFromBottom = node.scrollHeight - (node.scrollTop + node.offsetHeight);
			shouldScrollBottom = Math.abs(offSetFromBottom) < 10;
		},
		 
		componentDidUpdate: function (prevProps, prevState) {
			if (shouldScrollBottom) {
				this._scrollToBottom();
			}
		},

		_scrollToBottom: function () {
			let node = ReactDOM.findDOMNode(this.refs.scrollableContainer);
			if (node) {
				node.scrollTop = node.scrollHeight;
			}

			shouldScrollBottom = false;
		},

		dropdownContextGetter() {
			return ReactDOM.findDOMNode(this.refs.scrollableContainer);
		},

		render() {
			return <Component ref="scrollableContainer" {...this.props} dropdownContextGetter={ this.dropdownContextGetter }/>;
		},
	});

	return ScrollDecorator;
}
