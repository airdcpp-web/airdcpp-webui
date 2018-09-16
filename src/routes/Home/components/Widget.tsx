//import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import LoginStore from 'stores/LoginStore';

import { ActionMenu } from 'components/menu/DropdownMenu';
import WidgetActions from 'actions/WidgetActions';

import * as UI from 'types/ui';


const getError = (widgetInfo: UI.Widget, settings: UI.WidgetSettings) => {
  if (widgetInfo.formSettings && !settings.widget) {
    return 'Widget settings were not found';
  }

  if (widgetInfo.access && !LoginStore.hasAccess(widgetInfo.access)) {
    // tslint:disable-next-line:quotemark
    return "You aren't permitted to access this widget";
  }

  return null;
};

export interface WidgetProps {
  widgetInfo: UI.Widget;
  className?: string;
  settings: UI.WidgetSettings;
  componentId: string;
}

const Widget: React.SFC<WidgetProps> = ({ widgetInfo, settings, componentId, children, className, ...other }) => {
  const error = getError(widgetInfo, settings);
  const Component = widgetInfo.component;
  return (
    <div 
      className={ classNames('card', 'widget', className, componentId, widgetInfo.typeId) } 
      { ...other }
    >
      <div className="content header-row">
        <div className="header">
          <i className={ classNames('left floated large icon', widgetInfo.icon) }/>
          { settings.name }
        </div>

        <ActionMenu 
          className="widget-menu right top pointing"
          actions={ WidgetActions }
          itemData={{
            id: componentId,
            widgetInfo,
            settings,
          }}
        >
          { !!widgetInfo.actionMenu && <ActionMenu { ...widgetInfo.actionMenu }/> }
        </ActionMenu>
      </div>
      <div className="main content">
        { !!error ? error : (
          <Component
            componentId={ componentId }
            settings={ settings.widget }
          />
        ) }
      </div>
    </div>
  );
};

/*Widget.propTypes = {
  widgetInfo: PropTypes.object.isRequired,

  settings: PropTypes.object.isRequired,

  componentId: PropTypes.string.isRequired,
};*/

export default Widget;