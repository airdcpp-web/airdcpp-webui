import React from 'react';

const Loader = ({ text, className }) => (
	<div className={ 'ui active text loader ' + className }>
		{ text }
	</div>
);

Loader.propTypes = {
	text: React.PropTypes.node,
};

Loader.defaultProps = {
	text: 'Loading',
	className: '',
};

export default Loader
;