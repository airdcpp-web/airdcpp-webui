import React from 'react';

import classNames from 'classnames';


const Loader = ({ text, className, inline }) => {
	const style = classNames(
		'ui active text loader',
		{ 'inline': inline },
		className,
	);

	return (
		<div className={ style }>
			{ text }
		</div>
	);
};

Loader.propTypes = {
	text: React.PropTypes.node,
	inline: React.PropTypes.bool,
};

Loader.defaultProps = {
	text: 'Loading',
	className: '',
};

export default Loader
;