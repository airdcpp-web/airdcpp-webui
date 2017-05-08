import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import 'semantic-ui/components/accordion';
import 'semantic-ui/components/accordion.min.css';

import classNames from 'classnames';


const Accordion = React.createClass({
	propTypes: {
		controlled: PropTypes.bool,
		//activeIndexes: React.PropTypes.bool,
	},

	/*componentWillReceiveProps(nextProps) {
		if (!this.props.controlled || nextProps.activeIndexes === this.props.activeIndexes) {
			return;
		}

		let dom = ReactDOM.findDOMNode(this);
		nextProps.activeIndexes.forEach(id => {
			if (nextProps.active) {
				$(dom).accordion('open', id);
			} else {
				$(dom).accordion('close', id);
			}
		});
	},*/

	componentDidMount() {
		let dom = ReactDOM.findDOMNode(this);

		let settings = {};
		if (this.props.controlled) {
			settings = {
				on: 'disabled',
			};
		}

		$(dom).accordion(settings);

		/*if (this.props.active) {
			$(dom).accordion('open', 0);
		}*/
	},

	getDefaultProps() {
		return {
			className: '',
		};
	},

	render: function () {
		const accordionStyle = classNames(
			'ui accordion',
			this.props.className,
		);

		let { children } = this.props;
		return (
			<div className={ accordionStyle }>
				{ children }
			</div>
		);
	},
});

export default Accordion;
