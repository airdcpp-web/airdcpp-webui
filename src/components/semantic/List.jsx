import React from 'react';
import classNames from 'classnames';


export const ListItem = ({ header, description, className }) => (
	<div className={ classNames('item', className) }>
		<div className="header">
			{ header }
		</div>
		<div className="description">
			{ description }
		</div>
	</div>
);