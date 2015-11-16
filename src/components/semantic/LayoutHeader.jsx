import React from 'react';
import classNames from 'classnames';

const LayoutHeader = React.createClass({
	propTypes: {
		/**
		 * Header title
		 */
		title: React.PropTypes.node.isRequired,

		/**
		 * Subheader
		 */
		subHeader: React.PropTypes.node,

		/**
		 * Icon to display
		 */
		icon: React.PropTypes.node.isRequired,

		/**
		 * Component to display on the right side of the header
		 */
		component: React.PropTypes.node,

		/**
		 * Size of the header
		 */
		size: React.PropTypes.string,
	},

	getDefaultProps() {
		return {
			buttonCaption: 'Close',
			size: 'large',
		};
	},

	render() {
		let icon = this.props.icon;
		if (typeof icon === 'string') {
			icon = <i className={ this.props.icon + ' icon' }></i>;
		}

		const mainClassName = classNames(
			'header layout',
			this.props.className,
		);

		const headerClassName = classNames(
			'ui header main-header',
			this.props.size,
		);

		return (
			<div className={ mainClassName }>
				<div className={headerClassName}>
					{ icon }
					<div className="content">
						{ this.props.title }
						<div className="sub header">{ this.props.subHeader }</div>
					</div>
				</div>
				{ this.props.component }
			</div>
		);
	},
});

export default LayoutHeader
;