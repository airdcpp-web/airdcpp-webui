'use strict';
import React from 'react';


const SiteHeader = ({ leftContent, rightContent }) => (
	<div className="ui fixed inverted menu site-header">
		<div className="ui header-content">
			<div className="left">
				{ leftContent }
			</div>
			<div className="right">
				{ rightContent }
			</div>
		</div>
	</div>
);

export default SiteHeader;
