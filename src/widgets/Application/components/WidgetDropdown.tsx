import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import MenuItemLink from 'components/semantic/MenuItemLink';

import WidgetActions from 'actions/WidgetActions';
import WidgetStore from 'stores/WidgetStore';
import { Location } from 'history';

import * as UI from 'types/ui';
import { withRouter, RouteComponentProps } from 'react-router-dom';


const getWidgetItem = (widgetInfo: UI.Widget, location: Location) => {
  return (
    <MenuItemLink 
      key={ widgetInfo.typeId }
      onClick={ () => WidgetActions.actions.create(widgetInfo, location) }
      icon={ widgetInfo.icon }
    >
      { widgetInfo.name }
    </MenuItemLink>
  );
};

export type WidgetDropdownProps = Pick<UI.WidgetProps, 'componentId' | 'widgetT'>;

const WidgetDropdown: React.FC<WidgetDropdownProps & RouteComponentProps> = (
  { componentId, location, widgetT }
) => (
  <Dropdown 
    caption={ widgetT.translate('Add widget...') }
    className="create-widget"
    button={ true }
    contextElement={ `.${componentId}` }
  >
    { WidgetStore.widgets
      .filter(widgetInfo => !widgetInfo.alwaysShow)
      .map(widgetInfo => getWidgetItem(widgetInfo, location)) }
  </Dropdown>
);

const Decorated = withRouter(WidgetDropdown);

export default Decorated;