import React from 'react';
import ReactDOM from 'react-dom';
import invariant from 'invariant';

import classNames from 'classnames';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DropdownCaption from './DropdownCaption';


const Dropdown = React.createClass({
	mixins: [ PureRenderMixin ],
	propTypes: {
		/**
		 * Node to render as caption
		 */
		caption: React.PropTypes.node,

		/**
		 * Dropdown icon to display
		 * If caption isn't specified, the icon will be used as main trigger
		 */ 
		triggerIcon: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.node,
		]),

		/**
		 * Direction to render
		 */
		direction: React.PropTypes.string,

		/**
		 * Returns DOM node used for checking whether the dropdown can fit on screen
		 */
		contextGetter: React.PropTypes.func,

		/**
		 * Render as button
		 */
		button: React.PropTypes.bool,

		leftIcon: React.PropTypes.bool,
	},

	componentDidMount() {
		// Use timeout to allow all parents finish mounting (otherwise we get no context)
		setTimeout(this.init);
	},

	init() {
		if (!this.isMounted()) {
			return;
		}

		const dom = ReactDOM.findDOMNode(this);

		const settings = {
			direction: this.props.direction,
			action: 'hide',
			//debug: true,
			//verbose: true,
		};

		if (this.props.contextGetter) {
			settings['context'] = this.props.contextGetter();
			invariant(settings['context'], 'Context missing from dropdown');
		}

		$(dom).dropdown(settings);
	},

	getDefaultProps() {
		return {
			caption: null,
			className: '',
			triggerIcon: 'angle down',
			direction: 'auto',
		};
	},

	render: function () {
		const className = classNames(
			'ui',
			'dropdown',
			'item',
			this.props.className,
			{ 'labeled button': this.props.button },
			{ 'left-icon': this.props.leftIcon },
			'icon',
		);

		let icon = this.props.triggerIcon;
		if (typeof icon === 'string') {
			icon = <i className={ this.props.triggerIcon + ' trigger icon' }/>;
		}

		const { leftIcon, caption, header } = this.props;
		return (
			<div className={ className }>
				{ leftIcon && caption ? icon : null }
				<DropdownCaption>
					{ caption ? caption : icon }
				</DropdownCaption>
				{ leftIcon || !caption ? null : icon }

				<div className="menu">
					{ header ? (
						<div className="header">
							{ header }
						</div>
					) : null }
					{ this.props.children }
				</div>
			</div>
		);
	}
});

export default Dropdown;
