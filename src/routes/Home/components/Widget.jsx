import React from 'react';
import classNames from 'classnames';

import IconConstants from 'constants/IconConstants';

//import WidgetActions from 'actions/WidgetActions';
//import { ActionMenu } from 'components/menu/DropdownMenu';

import Dropdown from 'components/semantic/Dropdown';
import { MenuItemLink } from 'components/semantic/MenuItem';


const Widget = ({ widgetInfo, settings, componentId, children, className, onEdit, onRemove, ...widgetProps }) => {
	return (
		<div 
			className={ classNames('card', className, componentId, widgetInfo.typeId) } 
			{ ...widgetProps }
		>
			<div className="content header-row">
			  <div className="header">
			  	<i className={ 'left floated large icon ' + widgetInfo.icon }/>
			    { settings.name }
			  </div>

				<Dropdown 
					className="widget-menu right top pointing"
					//contextGetter={ _ => '.react-grid-item.' + componentId }
				>
					<MenuItemLink 
						onClick={ onEdit }
						icon={ IconConstants.EDIT }
					>
						Edit
					</MenuItemLink> 
					<MenuItemLink 
						onClick={ onRemove }
						icon={ IconConstants.REMOVE }
					>
						Remove
					</MenuItemLink>
				</Dropdown>
			</div>
			<div className="content widget">
				{ widgetInfo.formSettings && !settings.widget ? 'Widget settings were not found' : children }
			</div>
		</div>
	);
};

Widget.propTypes = {
	widgetInfo: React.PropTypes.object.isRequired,

	settings: React.PropTypes.object.isRequired,

	componentId: React.PropTypes.string.isRequired,

	onEdit: React.PropTypes.func.isRequired,
};

export default Widget;