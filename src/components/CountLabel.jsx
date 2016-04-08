import React from 'react';

import UrgencyUtils from 'utils/UrgencyUtils';
import TypeConvert from 'utils/TypeConvert';
import classNames from 'classnames';

const CountLabel = ({ urgencies, empty, size, className, circular }) => {
	if (!urgencies) {
		return null;
	}

	const max = UrgencyUtils.maxUrgency(urgencies);
	if (!max) {
		return null;
	}

	const labelClassName = classNames(
		'ui count label',
		{ 'empty': empty },
		{ 'circular': circular },
		size,
		className,
		TypeConvert.urgencyToColor(max),
	);

	return (
		<div className={ labelClassName }> 
			{ empty ? null : urgencies[max] } 
		</div>
	);
};

CountLabel.propTypes = {
	/**
	 * Urgency mapping [ urgency -> count ]
	 */
	urgencies: React.PropTypes.object,

	size: React.PropTypes.string,

	circular: React.PropTypes.bool,

	empty: React.PropTypes.bool,
};
	
CountLabel.defaultProps = {
	empty: false,
	size: '',
	circular: false,
};

export default CountLabel;
