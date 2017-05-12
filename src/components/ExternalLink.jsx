'use strict';

import React from 'react';

const ExternalLink = ({ url, children, className = '' }) => (
	<a 
		className={ className }
		href={ url } 
		target="_blank"
		rel="noopener noreferrer"
	>
		{ children }
	</a>
);

export default ExternalLink;