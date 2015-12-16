'use strict';
import React from 'react';
import Logo from '../../../images/AirDCPlusPlus.png';

const SiteHeader = ({ content }) => (
	<div className="ui fixed inverted menu site-header">
		<div className="ui header-content">
			<div href="#" className="header item">
				<img className="logo" src={ Logo }/>
			</div>
			{ content }
		</div>
	</div>
);

export default SiteHeader;
