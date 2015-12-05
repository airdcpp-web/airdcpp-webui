import React from 'react';

import UrgencyUtils from 'utils/UrgencyUtils';
import TypeConvert from 'utils/TypeConvert';
import classNames from 'classnames';

const CountLabel = React.createClass({
	propTypes: {
		/**
		 * Count and color for the label in format [count, "color"]
		 */
		urgencies: React.PropTypes.object,

		size: React.PropTypes.string,

		circular: React.PropTypes.bool,

		empty: React.PropTypes.bool,
	},
	
	getDefaultProps() {
		return {
			empty: false,
			size: '',
			circular: false,
		};
	},

	render() {
		const { urgencies, empty, size, className, circular } = this.props;
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
	},
});

export default CountLabel;
