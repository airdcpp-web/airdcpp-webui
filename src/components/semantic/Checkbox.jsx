import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import 'semantic-ui/components/checkbox';
import 'semantic-ui/components/checkbox.min.css';


const Checkbox = React.createClass({
	mixins: [ PureRenderMixin ],
	propTypes: {

		/**
		 * Selection state
		 */
		checked: PropTypes.bool.isRequired,

		/**
		 * Handler for state changes (receives bool as argument)
		 */
		onChange: PropTypes.func.isRequired,

		/**
		 * Checkbox caption
		 */
		caption: PropTypes.node,

		/**
		 * Display type (slider or toggle), leave undefined for default
		 */
		type: PropTypes.string,

		disabled: PropTypes.bool,
		floating: PropTypes.bool,
	},

	componentDidMount() {
		const settings = {
			fireOnInit: false,
			onChecked: () => this.props.onChange(true),
			onUnchecked: () => this.props.onChange(false),
		};

		let dom = ReactDOM.findDOMNode(this);
		$(dom).checkbox(settings);
	},

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.checked != this.props.checked) {
			let dom = ReactDOM.findDOMNode(this);
			if (nextProps.checked) {
				$(dom).checkbox('set checked');
			} else {
				$(dom).checkbox('set unchecked');
			}
		}
	},

	render: function () {
		const { className, checked, caption, type, disabled, floating } = this.props;

		const checkboxStyle = classNames(
			'ui checkbox',
			{ 'disabled': disabled },
			{ 'floating': floating },
			className,
			type,
		);

		return (
			<div className={ checkboxStyle }>
				<input type="checkbox" defaultChecked={ checked }/>
				{ caption && (
					<label>
						{ caption }
					</label>
					) }
			</div>);
	},
});

export default Checkbox;