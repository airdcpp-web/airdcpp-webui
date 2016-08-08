import React from 'react';

import classNames from 'classnames';

const Message = ({ className, title, description, icon, isError }) => {
	const style = classNames(
		'ui message',
		{ 'negative': isError },
		{ 'icon': icon },
		className,
	);

	if (description && typeof description !== 'string') {
		description = React.cloneElement(description, {
			className: description.props.className + ' description'
		});
	}

	return (
		<div className={ style }>
			{ (icon ? <i className={ icon + ' icon' }/> : null) }
			<div className="content">
				<div className="header">
					{ title }
				</div>
				{ description } 
			</div>
		</div>
	);
};

Message.propTypes = {
	/**
	 * Message title
	 */
	title: React.PropTypes.node,

	/**
	 * Message content
	 */
	description: React.PropTypes.node,

	isError: React.PropTypes.bool,

	icon: React.PropTypes.string,
};

export default Message
;