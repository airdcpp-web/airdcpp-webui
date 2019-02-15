//import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import LoginStore from 'stores/LoginStore';

import { ActionMenu } from 'components/menu';
import WidgetActions from 'actions/WidgetActions';

import * as UI from 'types/ui';

import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { getWidgetT } from 'utils/WidgetUtils';


const getError = (widgetInfo: UI.Widget, settings: UI.WidgetSettings, t: i18next.TFunction) => {
  if (widgetInfo.formSettings && !settings.widget) {
    return t('widget.settingsMissing');
  }

  if (widgetInfo.access && !LoginStore.hasAccess(widgetInfo.access)) {
    return t('widget.accessDenied');
  }

  return null;
};

export interface WidgetProps {
  widgetInfo: UI.Widget;
  className?: string;
  settings: UI.WidgetSettings;
  componentId: string;
  rootWidgetT: UI.ModuleTranslator;
}

const Widget: React.FC<WidgetProps> = ({ 
  widgetInfo, settings, componentId, children, className, rootWidgetT, ...other 
}) => {
  const { t } = useTranslation();
  const error = getError(widgetInfo, settings, t);
  const Component = widgetInfo.component;
  

  const widgetT = getWidgetT(widgetInfo, t);
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
          { !!widgetInfo.actionMenu && (
            <ActionMenu 
              actions={ widgetInfo.actionMenu.actions }
              ids={ widgetInfo.actionMenu.ids } 
            /> 
          ) }
        </ActionMenu>
      </div>
      <div className="main content">
        { !!error ? error : (
          <Component
            componentId={ componentId }
            settings={ settings.widget }
            widgetT={ widgetT }
            rootWidgetT={ rootWidgetT }
          />
        ) }
      </div>
      {/* "children" contains the resize handle */}
      { children }
    </div>
  );
};

/*Widget.propTypes = {
  widgetInfo: PropTypes.object.isRequired,

  settings: PropTypes.object.isRequired,

  componentId: PropTypes.string.isRequired,
};*/

export default Widget;