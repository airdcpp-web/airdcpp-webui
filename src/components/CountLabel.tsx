//import PropTypes from 'prop-types';
import * as React from 'react';

import { maxUrgency } from 'utils/UrgencyUtils';
import { urgencyToColor } from 'utils/TypeConvert';
import classNames from 'classnames';

import { CSSTransition, TransitionGroup } from 'react-transition-group';

import * as UI from 'types/ui';

export interface CountLabelProps {
  urgencies: UI.UrgencyCountMap | null;
  empty?: boolean; // Don't show the number of urgency items
  size?: string;
  circular?: boolean;
  className?: string;
  onClick?: (evt: React.SyntheticEvent<any>) => void;
}

const CountLabel: React.FC<CountLabelProps> = ({
  urgencies,
  empty,
  size,
  className,
  circular,
  onClick,
}) => {
  // We must always have valid urgencies when the component is rendered (checked by AnimatedCountLabel)
  if (!urgencies) {
    return null;
  }

  const max = maxUrgency(urgencies);
  if (!max) {
    return null;
  }

  const labelClassName = classNames(
    'ui count label',
    { empty: empty },
    { circular: circular },
    size,
    className,
    urgencyToColor(max)
  );

  return (
    <div className={labelClassName} onClick={onClick}>
      {empty ? null : urgencies[max]}
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

// Fade out the label when there are no counts
const AnimatedCountLabel: React.FC<CountLabelProps> = (props) => (
  <TransitionGroup component={null}>
    {!!props.urgencies && (
      <CSSTransition classNames="label-transition" timeout={{ enter: 100, exit: 1500 }}>
        <CountLabel key="label" {...props} />
      </CSSTransition>
    )}
  </TransitionGroup>
);

export default AnimatedCountLabel;
