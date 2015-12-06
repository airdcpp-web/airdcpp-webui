'use strict';

import React from 'react';

import { Link, IndexLink } from 'react-router';
import CountLabel from 'components/CountLabel';


const IconMenuItem = ({ urgencies, icon, title, indexLink, ...props }) => {
	const LinkElement = indexLink ? IndexLink : Link;

	return (
		<LinkElement { ...props }>
			<CountLabel className="mini" urgencies={urgencies}/>
			<i className={ icon + ' icon' }></i>
			{ title }
		</LinkElement>
	);
};

IconMenuItem.propTypes = {
	urgencies: React.PropTypes.object,
	icon: React.PropTypes.string.isRequired,
	title: React.PropTypes.node.isRequired,
};

IconMenuItem.contextTypes = {
	history: React.PropTypes.object.isRequired
};


const TextMenuItem = ({ title, indexLink, ...props }) => {
	const LinkElement = indexLink ? IndexLink : Link;
	return (
		<LinkElement { ...props }>
			{title}
		</LinkElement>
	);
};

TextMenuItem.propTypes = {
	title: React.PropTypes.node.isRequired,
};

TextMenuItem.contextTypes = {
	history: React.PropTypes.object.isRequired
};


const getMenuItem = (onClick, item, ContentElement) => {
	const { url, className, unreadInfoStore, ...other } = item;
	return (
		<ContentElement 
			key={ url }
			to={ url } 
			activeClassName="active" 
			onClick={ onClick ? (evt) => onClick(url, evt) : undefined }
			className={ 'item ' + (className ? className : '') }
			indexLink={ url === '/' }
			urgencies={ unreadInfoStore ? unreadInfoStore.getTotalUrgencies() : null }
			{ ...other }
		/>
	);
};

const getIconMenuItem = (onClick, item) => {
	return getMenuItem(onClick, item, IconMenuItem);
};

const getTextMenuItem = (onClick, item) => {
	return getMenuItem(onClick, item, TextMenuItem);
};

export { getIconMenuItem, getTextMenuItem };