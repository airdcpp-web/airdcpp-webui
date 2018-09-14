import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';


export interface ProgressProps {
  caption: React.ReactNode;
  className?: string | null;
  percent: number;
}

const Progress: React.SFC<ProgressProps> = ({ className, percent, caption }) => (
  <div 
    className={ classNames('ui progress', className) } 
    data-percent={ percent }
  >
    <div 
      className="bar" 
      style={{ 
        transitionDuration: 300 + 'ms',
        width: percent + '%',
      }}
    >
      <div className="progress"/>
    </div>
    <div className="label">
      { caption }
    </div>
  </div>
);

Progress.propTypes = {
  percent: PropTypes.number.isRequired,
  caption: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Progress;