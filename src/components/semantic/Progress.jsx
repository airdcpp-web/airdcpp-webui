import React from 'react';

const Progress = ({ className, percent, caption }) => (
	<div className={ 'ui progress ' + className } data-percent= { percent }>
		<div className="bar" style={{ transitionDuration: 300 + 'ms' }, { width: percent + '%' }}>
			<div className="progress"/>
		</div>
		<div className="label">{ caption }</div>
	</div>
);

Progress.propTypes = {
	percent: React.PropTypes.number.isRequired,
	caption: React.PropTypes.node.isRequired,
};

export default Progress;