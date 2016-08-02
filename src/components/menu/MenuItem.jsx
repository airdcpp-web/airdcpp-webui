'use strict';

import React from 'react';

import { Link } from 'react-router';
import CountLabel from 'components/CountLabel';


const IconMenuItem = ({ urgencies, icon, title, indexLink, linkProps }) => (
	<Link { ...linkProps }>
		<CountLabel className="mini" urgencies={ urgencies }/>
		<i className={ icon + ' caption icon' }/>
		{ title }
	</Link>
);

IconMenuItem.propTypes = {
	urgencies: React.PropTypes.object,
	icon: React.PropTypes.string.isRequired,
	title: React.PropTypes.node.isRequired,
	urgencies: React.PropTypes.object,
};


const TextMenuItem = ({ title, indexLink, linkProps }) => (
	<Link { ...linkProps }>
		{ title }
	</Link>
);

TextMenuItem.propTypes = {
	title: React.PropTypes.node.isRequired,
};


const getMenuItem = (onClick, item, ContentElement) => {
	const { url, className, unreadInfoStore, ...other } = item;
	return (
		<ContentElement 
			key={ url }
			{ ...other }
			linkProps={{
				to: url,
				activeClassName: 'active',
				onClick: onClick ? evt => onClick(url, evt) : undefined,
				className: 'item ' + (className ? className : ''),
				onlyActiveOnIndex: url === '/'
			}}
			urgencies={ unreadInfoStore ? unreadInfoStore.getTotalUrgencies() : null }
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