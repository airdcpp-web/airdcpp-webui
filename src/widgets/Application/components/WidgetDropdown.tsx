import PropTypes from 'prop-types';
import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import MenuItemLink from 'components/semantic/MenuItemLink';

import WidgetActions from 'actions/WidgetActions';
import WidgetStore from 'stores/WidgetStore';
import { Location } from 'history';


const getWidgetItem = (widgetInfo: UI.Widget, location: Location) => {
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

export interface WidgetDropdownProps {
  componentId: string;
}

const WidgetDropdown: React.SFC<WidgetDropdownProps> = ({ componentId }, { router }) => (
  <Dropdown 
    caption="Add widget..."
    className="create-widget"
    button={ true }
    contextElement={ '.' + componentId }
  >
    { (WidgetStore.widgets as UI.Widget[])
      .filter(widgetInfo => !widgetInfo.alwaysShow)
      .map(widgetInfo => getWidgetItem(widgetInfo, router.route.location)) }
  </Dropdown>
);

WidgetDropdown.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default WidgetDropdown;