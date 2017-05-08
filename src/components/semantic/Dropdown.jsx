import PropTypes from 'prop-types';
import React from 'react';
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
		caption: PropTypes.node,

		/**
		 * Dropdown icon to display
		 * If caption isn't specified, the icon will be used as main trigger
		 */ 
		triggerIcon: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.node,
		]),

		/**
		 * Show trigger icon on the left side of the caption instead of after it
		 */
		leftIcon: PropTypes.bool,

		/**
		 * Direction to render
		 */
		direction: PropTypes.string,

		/**
		 * Returns DOM node used for checking whether the dropdown can fit on screen
		 */
		contextGetter: PropTypes.func,

		/**
		 * Render as button
		 */
		button: PropTypes.bool,

		settings: PropTypes.object,
	},

	componentDidMount() {
		// Use timeout to allow all parents finish mounting (otherwise we get no context)
		setTimeout(this.init);
	},

	init() {
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

		$(this.c).dropdown(settings);
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
			<div 
				ref={ c => this.c = c } 
				className={ className }
			>
				{ (leftIcon && caption) && icon }
				<DropdownCaption>
					{ caption ? caption : icon }
				</DropdownCaption>
				{ leftIcon || !caption ? null : icon }

				<div className="menu">
					{ header && (
						<div className="header">
							{ header }
						</div>
					) }
					{ this.props.children }
				</div>
			</div>
		);
	}
});

export default Dropdown;
