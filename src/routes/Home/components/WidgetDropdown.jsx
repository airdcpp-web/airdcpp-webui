import React from 'react';

//import IconConstants from 'constants/IconConstants';

import Dropdown from 'components/semantic/Dropdown';
import { MenuItemLink } from 'components/semantic/MenuItem';


const getWidgetItem = (widgetInfo, onClickItem) => {
	return (
		<MenuItemLink 
			key={ widgetInfo.id }
			onClick={ () => onClickItem(widgetInfo) }
			icon={ widgetInfo.icon }
		>
			{ widgetInfo.name }
		</MenuItemLink>
	);
};

const WidgetDropdown = ({ widgets, onClickItem, ...widgetProps }) => (
	<Dropdown 
		caption="Create widget"
		className="create-widget"
		button={ true }
		//icon={ IconConstants.CREATE }
		{ ...widgetProps }
	>
		{ widgets.map(widgetInfo => getWidgetItem(widgetInfo, onClickItem)) }
	</Dropdown>
);

WidgetDropdown.propTypes = {
	/**
	 * Priority object
	 */
	onClickItem: React.PropTypes.func.isRequired,

	/**
	 * Item with priority properties
	 */
	widgets: React.PropTypes.array.isRequired,
};

export default WidgetDropdown;