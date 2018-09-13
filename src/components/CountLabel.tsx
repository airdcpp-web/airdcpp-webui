//import PropTypes from 'prop-types';
import React from 'react';

import { maxUrgency } from 'utils/UrgencyUtils';
import { urgencyToColor } from 'utils/TypeConvert';
import classNames from 'classnames';

import { CSSTransition, TransitionGroup } from 'react-transition-group';


interface CountLabelProps {
  urgencies: UI.UrgencyCountMap;
  empty?: boolean;
  size?: string;
  circular?: boolean;
  className?: string;
}

const CountLabel: React.SFC<CountLabelProps> = ({ urgencies, empty, size, className, circular }) => {
  // We must always have valid urgencies when the component is rendered (checked by AnimatedCountLabel)
  const max = maxUrgency(urgencies);
  if (!max) {
    return null;
  }

  const labelClassName = classNames(
    'ui count label',
    { 'empty': empty },
    { 'circular': circular },
    size,
    className,
    urgencyToColor(max),
  );

  return (
    <div className={ labelClassName }> 
      { empty ? null : urgencies[max] } 
    </div>
  );
};

/*CountLabel.propTypes = {
	// Urgency mapping [ urgency -> count ]
  urgencies: PropTypes.object,

  size: PropTypes.string,

  circular: PropTypes.bool,

  empty: PropTypes.bool,
};*/

CountLabel.defaultProps = {
  empty: false,
  size: '',
  circular: false,
};


// Rendering a single child with TransitionGroup: https://facebook.github.io/react/docs/animation.html#rendering-a-single-child
// We don't any wrapping divs to avoid issues with Semantic CSS
/*const FirstChild: React.SFC<CountLabelProps> = (props) => {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
};*/

// Fade out the label when there are no counts
const AnimatedCountLabel: React.SFC<CountLabelProps> = (props) => (
  <TransitionGroup
    component={ null }
  >
    { props.urgencies && (
      <CSSTransition
        classNames="label-transition"
        timeout={{ enter: 100, exit: 1500 }}
      >
        <CountLabel 
          key="label" 
          { ...props }
        /> 
      </CSSTransition>
    ) }
  </TransitionGroup>
);

export default AnimatedCountLabel;
