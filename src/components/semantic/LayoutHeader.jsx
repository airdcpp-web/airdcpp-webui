import React from 'react';

import Icon from 'components/semantic/Icon';

import classNames from 'classnames';


const LayoutHeader = ({ className, icon, component, size, title, subHeader }) => {
	const mainClassName = classNames(
		'header layout',
		{ 'icon': icon },
		className,
	);

	const headerClassName = classNames(
		'ui header left',
		size,
	);

	return (
		<div className={ mainClassName }>
			<div className={ headerClassName }>
				<Icon icon={ icon }/>
				<div className="content">
					{ title }
					<div className="sub header">
						{ subHeader }
					</div>
				</div>
			</div>
			{ component }
		</div>
	);
};

LayoutHeader.defaultProps = {
	buttonCaption: 'Close',
	size: 'large',
};

LayoutHeader.propTypes = {
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
};

export default LayoutHeader
;