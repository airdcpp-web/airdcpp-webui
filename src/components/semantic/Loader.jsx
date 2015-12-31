import React from 'react';

import classNames from 'classnames';


const Loader = ({ text, className, inline, size }) => {
	const style = classNames(
		'ui active  loader',
		{ 'inline': inline },
		{ 'text': !inline }, // Should be used even if there is no text because of styling
		className,
		size,
	);

	if (inline && text.length > 0) {
		return (
			<div className="inline-loader">
				<div className={ style }/>
				{ text }
			</div>
		);
	}

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
	size: '',
};

export default Loader
;