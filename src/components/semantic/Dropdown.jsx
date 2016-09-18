import React from 'react';
import ReactDOM from 'react-dom';
import invariant from 'invariant';

import classNames from 'classnames';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import DropdownCaption from './DropdownCaption';
import Icon from './Icon';

import 'semantic-ui/components/dropdown';
import 'semantic-ui/components/dropdown.min.css';


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

		settings: React.PropTypes.object,
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
			showOnFocus: false, // It can become focused when opening a modal
			...this.props.settings,
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
			triggerIcon: 'angle down',
			direction: 'auto',
		};
	},

	render: function () {
		const { leftIcon, caption, header, button, triggerIcon } = this.props;
		const className = classNames(
			'ui',
			'dropdown',
			'item',
			this.props.className,
			{ 'icon button': button },
			{ 'labeled': button && caption },
			{ 'left-icon': leftIcon },
		);

		let icon = <Icon icon={ triggerIcon } className="trigger"/>;
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
