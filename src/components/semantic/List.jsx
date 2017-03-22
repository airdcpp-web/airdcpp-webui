import React from 'react';
import classNames from 'classnames';
import Icon from 'components/semantic/Icon';


export const ListItem = ({ header, description, icon, className, children }) => (
	<div className={ classNames('item', className) }>
		<Icon icon={ icon }/>
		<div className="content">
			<div className="header">
				{ header }
			</div>
			{ description && (
				<div className="description">
					{ description }
				</div> 
			) }
			{ children }
		</div>
	</div>
);