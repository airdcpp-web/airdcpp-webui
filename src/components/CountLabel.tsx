import * as React from 'react';

import { maxUrgency } from '@/utils/UrgencyUtils';
import { urgencyToColor } from '@/utils/TypeConvert';
import classNames from 'classnames';

import { CSSTransition, TransitionGroup } from 'react-transition-group';

import * as UI from '@/types/ui';

export interface CountLabelProps {
  // Urgency mapping [ urgency -> count ]
  urgencies: UI.UrgencyCountMap | null;
  empty?: boolean; // Don't show the number of urgency items
  size?: string;
  circular?: boolean;
  className?: string;
  // onClick?: (evt: React.SyntheticEvent<any>) => void;
}

const CountLabel = React.forwardRef<HTMLDivElement, CountLabelProps>(function CountLabel(
  { urgencies, empty = false, size, className, circular = false },
  ref,
) {
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
    urgencyToColor(max),
  );

  return (
    <div ref={ref} className={labelClassName}>
      {empty ? null : urgencies[max]}
    </div>
  );
});

// Fade out the label when there are no counts
const AnimatedCountLabel: React.FC<CountLabelProps> = (props) => {
  const nodeRef = React.useRef(null);
  return (
    <TransitionGroup component={null}>
      {!!props.urgencies && (
        <CSSTransition
          nodeRef={nodeRef}
          classNames="label-transition"
          timeout={{ enter: 100, exit: 1500 }}
        >
          <CountLabel ref={nodeRef} key="label" {...props} />
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};

export default AnimatedCountLabel;
