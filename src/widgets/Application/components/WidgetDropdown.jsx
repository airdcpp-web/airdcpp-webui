import PropTypes from 'prop-types';
import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import MenuItemLink from 'components/semantic/MenuItemLink';

import WidgetActions from 'actions/WidgetActions';
import WidgetStore from 'stores/WidgetStore';


const getWidgetItem = (widgetInfo, location) => {
  return (
    <MenuItemLink 
      key={ widgetInfo.typeId }
      onClick={ () => WidgetActions.create(widgetInfo, location) }
      icon={ widgetInfo.icon }
    >
      { widgetInfo.name }
    </MenuItemLink>
  );
};

const WidgetDropdown = ({ widgets, onClickItem, componentId, ...widgetProps }, { router }) => (
  <Dropdown 
    caption="Add widget..."
    className="create-widget"
    button={ true }
    contextElement={ '.' + componentId }
    { ...widgetProps }
  >
    { WidgetStore.widgets
      .filter(widgetInfo => !widgetInfo.alwaysShow)
      .map(widgetInfo => getWidgetItem(widgetInfo, router.route.location)) }
  </Dropdown>
);

WidgetDropdown.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default WidgetDropdown;