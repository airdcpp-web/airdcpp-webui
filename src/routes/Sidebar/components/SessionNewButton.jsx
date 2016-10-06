import React from 'react';
import classNames from 'classnames';

import IconConstants from 'constants/IconConstants';
import { RouterMenuItemLink } from 'components/semantic/MenuItem';


const onClick = (evt, pushNew) => {
	evt.preventDefault();

	pushNew();
};


const SessionNewButton = ({ url, title, pushNew, className }) => (
	<RouterMenuItemLink 
		key="button-new" 
		className={ classNames('new', className) }
		icon={ IconConstants.CREATE }
		url={ url } 
		onClick={ evt => onClick(evt, pushNew) }
	>
		{ title }
	</RouterMenuItemLink>
);

SessionNewButton.propTypes = {
	/**
	 * Base URL of the section
	 */
	url: React.PropTypes.string.isRequired,

	/**
	 * Title of the button
	 */
	title: React.PropTypes.node.isRequired,

	pushNew: React.PropTypes.func.isRequired,
};

export default SessionNewButton;