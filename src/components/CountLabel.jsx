import React from 'react';

import UrgencyUtils from 'utils/UrgencyUtils';
import TypeConvert from 'utils/TypeConvert';
import classNames from 'classnames';

import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';


const CountLabel = ({ urgencies, empty, size, className, circular }) => {
	// We must always have valid urgencies when the component is rendered (checked by AnimatedCountLabel)
	const max = UrgencyUtils.maxUrgency(urgencies);

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


// Rendering a single child with ReactCSSTransitionGroup: https://facebook.github.io/react/docs/animation.html
const FirstChild = (props) => {
	const childrenArray = React.Children.toArray(props.children);
	return childrenArray[0] || null;
};

// Fade out the label when there are no counts
const AnimatedCountLabel = (props) => (
	<ReactCSSTransitionGroup
		component={ FirstChild }
		transitionName="label-transition"
		transitionEnterTimeout={ 100 }
		transitionLeaveTimeout={ 1500 }
	>
		{ props.urgencies && <CountLabel key="label" { ...props }/> }
	</ReactCSSTransitionGroup>
);

export default AnimatedCountLabel;
