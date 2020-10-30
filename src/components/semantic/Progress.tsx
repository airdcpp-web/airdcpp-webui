import PropTypes from 'prop-types';
import * as React from 'react';
import classNames from 'classnames';


export interface ProgressProps {
  caption?: React.ReactNode;
  className?: string | null;
  percent?: number;
}

const Progress: React.FC<ProgressProps> = ({ className, percent, caption }) => (
  <div 
    className={ classNames(
      'ui progress', 
      className, 
      { 'indeterminate': percent === undefined },
    ) } 
    data-percent={ percent }
  >
    <div 
      className="bar" 
      style={{ 
        transitionDuration: 300 + 'ms',
        width: percent === undefined ? undefined : percent + '%',
        minWidth: '0px'
      }}
    >
      <div className="progress"/>
    </div>
    { !!caption && (
      <div className="label">
        { caption }
      </div>
    )}
  </div>
);

Progress.propTypes = {
  percent: PropTypes.number.isRequired,
  caption: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Progress;