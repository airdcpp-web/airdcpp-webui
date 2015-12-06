import React from 'react';
import classNames from 'classnames';

const DropdownItem = ({ className, active, children, ...other }) => {
	const itemClass = classNames(
		'item',
		className,
		{ 'active': active	}
	);

	return (
		<a className={ itemClass } {...other}>
			{ children }
		</a>
	);
};

DropdownItem.propTypes = {
	className: React.PropTypes.string,
	active: React.PropTypes.bool,
};

export default DropdownItem
;