import React from 'react';

import classNames from 'classnames';

const Message = React.createClass({
	propTypes: {
		/**
		 * Message title
		 */
		title: React.PropTypes.node,

		/**
		 * Error details
		 */
		description: React.PropTypes.node,

		isError: React.PropTypes.bool,

		icon: React.PropTypes.string,
	},

	render: function () {
		const style = classNames(
			'ui message',
			{ 'negative': this.props.isError },
			{ 'icon': this.props.icon },
			this.props.className,
		);

		return (
			<div className={style}>
				{ (this.props.icon ? <i className={ this.props.icon + ' icon' }></i> : null) }
				<div className="content">
					<div className="header">
						{ this.props.title }
					</div>
					{this.props.description}
				</div>
			</div>
		);
	}
});

export default Message
;