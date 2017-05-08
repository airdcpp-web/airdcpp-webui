import PropTypes from 'prop-types';
import React from 'react';

import 'semantic-ui/components/accordion';
import 'semantic-ui/components/accordion.min.css';

import classNames from 'classnames';


const Accordion = React.createClass({
	propTypes: {
		controlled: PropTypes.bool,
	},

	componentDidMount() {
		let settings = {};
		if (this.props.controlled) {
			settings = {
				on: 'disabled',
			};
		}

		$(this.c).accordion(settings);
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
			<div 
				ref={ c => this.c = c } 
				className={ accordionStyle }
			>
				{ children }
			</div>
		);
	},
});

export default Accordion;
