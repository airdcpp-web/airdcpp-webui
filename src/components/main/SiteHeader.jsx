'use strict';
import React from 'react';

import { IndexLink } from 'react-router';
import Logo from '../../../images/AirDCPlusPlus.png';


const SiteHeader = ({ content }) => (
	<div className="ui fixed inverted menu site-header">
		<div className="ui header-content">
			<IndexLink to="/" className="item">
				<img className="logo" src={ Logo }/>
			</IndexLink>
			{ content }
		</div>
	</div>
);

export default SiteHeader;
