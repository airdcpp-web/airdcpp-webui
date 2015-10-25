import React from 'react';

export default function (Component) {
	let shouldScrollBottom = false;

	const ScrollDecorator = React.createClass({
		displayName: 'ScrollDecorator',
		componentDidMount: function () {
			this._scrollToBottom();
		},

		componentWillUpdate: function () {
			let node = React.findDOMNode(this.refs.scrollableContainer);
			if (!node) {
				shouldScrollBottom = false;
				return;
			}

			const offSetFromBottom = node.scrollHeight - (node.scrollTop + node.offsetHeight);
			shouldScrollBottom = Math.abs(offSetFromBottom) < 10;
		},
		 
		componentDidUpdate: function () {
			if (shouldScrollBottom) {
				this._scrollToBottom();
			}
		},

		_scrollToBottom: function () {
			let node = React.findDOMNode(this.refs.scrollableContainer);
			if (node) {
				node.scrollTop = node.scrollHeight;
			}

			shouldScrollBottom = false;
		},

		render() {
			return <Component ref="scrollableContainer" {...this.props} {...this.state}/>;
		},
	});

	return ScrollDecorator;
}
