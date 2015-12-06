import React from 'react';

const Loader = ({ text }) => (
	<div className="ui active text loader">
		{ text }
	</div>
);

Loader.propTypes = {
	text: React.PropTypes.node,
};

Loader.defaultProps = {
	text: 'Loading'
};

export default Loader
;