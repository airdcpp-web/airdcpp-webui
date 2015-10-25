import React from 'react';
import classNames from 'classnames';

const DropdownItem = React.createClass({
	render() {
		const className = classNames(
			'item',
			this.props.className,
			{ 'active': this.props.active	}
		);

		return (
			<a className={ className } {...this.props}>
				{this.props.children}
			</a>
		);
	}
});

export default DropdownItem
;