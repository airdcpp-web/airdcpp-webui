'use strict';

import React from 'react';

const ExternalLink = ({ url, children, className = '' }) => (
	<a 
		className={ className }
		href={ url } 
		target="_blank"
		rel="noreferrer"
	>
		{ children }
	</a>
);

export default ExternalLink;