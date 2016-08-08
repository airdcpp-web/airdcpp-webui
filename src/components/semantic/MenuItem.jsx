'use strict';
import React from 'react';
import classNames from 'classnames';

import { Link } from 'react-router';
import CountLabel from 'components/CountLabel';


export const RouterMenuItemLink = ({ url, className, icon, children, onClick, urgencies }) => {
	return (
		<Link 
			to={ url } 
			className={ classNames('item', className) } 
			activeClassName="active" 
			onClick={ onClick }
			onlyActiveOnIndex={ url === '/' }
		>
			{ icon ? <i className={ 'icon ' + icon }/> : null }
			{ children }
			{ urgencies ? <CountLabel urgencies={ urgencies }/> : null }
		</Link>
	);
};

RouterMenuItemLink.propTypes = {
	/**
	 * Item URL
	 */
	url: React.PropTypes.string.isRequired,

	/**
	 * Title of the button
	 */
	children: React.PropTypes.any.isRequired,

	icon: React.PropTypes.string,

	/**
	 * For overriding the default link action (still gives the active class style)
	 */
	onClick: React.PropTypes.func,

	urgencies: React.PropTypes.object,
};


export const MenuItemLink = ({ className, icon, children, onClick, active }) => {
	const itemClass = classNames(
		'item',
		className,
		{ 'active': active	}
	);

	return (
		<a className={ itemClass } onClick={ onClick }>
			{ icon ? <i className={ 'icon ' + icon }/> : null }
			{ children }
		</a>
	);
};

MenuItemLink.propTypes = {
	/**
	 * Title of the button
	 */
	children: React.PropTypes.any.isRequired,

	icon: React.PropTypes.string,

	onClick: React.PropTypes.func.isRequired,

	active: React.PropTypes.bool,
};

//export default MenuItemLink;