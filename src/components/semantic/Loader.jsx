import PropTypes from 'prop-types';
import React from 'react';

import classNames from 'classnames';

import 'semantic-ui/components/loader.min.css';


const Loader = ({ text, className, inline, size, inverted }) => {
	const style = classNames(
		'ui active  loader',
		{ 'inverted': inverted },
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
	text: PropTypes.node,
	inline: PropTypes.bool,
};

Loader.defaultProps = {
	text: 'Loading',
};

export default Loader
;