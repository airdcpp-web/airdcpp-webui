'use strict';

import React from 'react';


export const Row = ({ title, text }) => (
	<div className="ui row">
		<div className="four wide column">
			<div className="ui tiny header">
			{ title }
			</div>
		</div>
		<div className="twelve wide column">
			{ text }
		</div>
	</div>
);

export const Header = ({ title }) => (
	<div className="ui blue section header">
		{ title }
	</div>
);