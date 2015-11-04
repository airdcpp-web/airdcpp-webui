import React from 'react';
import ReactDOM from 'react-dom';

const Accordion = React.createClass({
	componentDidMount() {
		let dom = ReactDOM.findDOMNode(this);
		$(dom).accordion();
	},

	getDefaultProps() {
		return {
			className: '',
		};
	},

	render: function () {
		return (
			<div className={ 'ui accordion ' + this.props.className }>
				{ this.props.children }
			</div>
		);
	},
});

export default Accordion;
