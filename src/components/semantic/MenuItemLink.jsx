'use strict';

import React from 'react';

import { Link } from 'react-router';

const MenuItemLink = ({ url, className, icon, title }) => {
	return (
		<Link to={ url } className={ 'item ' + className } activeClassName="active">
			{ icon ? <i className={ 'icon ' + icon }/> : null }
			{ title }
		</Link>
	);
};

MenuItemLink.propTypes = {
	/**
	 * Item URL
	 */
	url: React.PropTypes.string.isRequired,

	/**
	 * Title of the button
	 */
	title: React.PropTypes.any.isRequired,

	icon: React.PropTypes.string,
};

MenuItemLink.defaultProps = {
	className: '',
};

export default MenuItemLink;