import React from 'react';

const Progress = React.createClass({
	render: function () {
		return (
			<div className={ 'ui progress ' + this.props.className } data-percent= { this.props.percent }>
				<div className="bar" style={{ transitionDuration: 300 + 'ms' }, { width: this.props.percent + '%' }}>
					<div className="progress"></div>
				</div>
				<div className="label">{ this.props.caption }</div>
			</div>
		);
	}
});

export default Progress;