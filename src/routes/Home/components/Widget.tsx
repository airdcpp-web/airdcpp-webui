import * as React from 'react';
import classNames from 'classnames';

import { ActionMenu } from 'components/action-menu';

import * as UI from 'types/ui';

import { getWidgetT, translateWidgetName } from 'utils/WidgetUtils';
import { WidgetEditActionMenu } from 'actions/ui/widget';
import { AuthenticatedSession, useSession } from 'context/SessionContext';

const getError = (
  widgetInfo: UI.Widget,
  settings: UI.WidgetSettings,
  rootWidgetT: UI.ModuleTranslator,
  { hasAccess }: AuthenticatedSession,
) => {
  if (widgetInfo.formSettings && !settings.widget) {
    return rootWidgetT.t('settingsMissing', 'Widget settings missing');
  }

  if (widgetInfo.access && !hasAccess(widgetInfo.access)) {
    return rootWidgetT.t('accessDenied', `You aren't allowed to access this widget`);
  }

  return null;
};

export type WidgetProps = React.PropsWithChildren<{
  widgetInfo: UI.Widget;
  className?: string;
  settings: UI.WidgetSettings;
  componentId: string;
  rootWidgetT: UI.ModuleTranslator;
}>;

const Widget = React.forwardRef<HTMLDivElement, WidgetProps>(function Widget(
  { widgetInfo, settings, componentId, children, className, rootWidgetT, ...other },
  ref,
) {
  const session = useSession();
  const error = getError(widgetInfo, settings, rootWidgetT, session);
  const Component = widgetInfo.component;

  const widgetT = getWidgetT(widgetInfo, rootWidgetT.plainT);
  return (
    <div
      {...other}
      ref={ref}
      className={classNames('card', 'widget', className, componentId, widgetInfo.typeId)}
    >
      <div className="content header-row">
        <div className="header">
          <i className={classNames('left floated large icon', widgetInfo.icon)} />
          {!!settings.name
            ? settings.name
            : translateWidgetName(widgetInfo, rootWidgetT.plainT)}
        </div>

        <ActionMenu
          className="widget-menu right top pointing"
          actions={WidgetEditActionMenu}
          itemData={{
            id: componentId,
            widgetInfo,
            settings,
          }}
        >
          {!!widgetInfo.actionMenu && (
            <ActionMenu
              actions={widgetInfo.actionMenu.actions}
              ids={widgetInfo.actionMenu.ids}
            />
          )}
        </ActionMenu>
      </div>
      <div className="main content">
        {!!error ? (
          error
        ) : (
          <Component
            componentId={componentId}
            settings={settings.widget}
            widgetT={widgetT}
            rootWidgetT={rootWidgetT}
          />
        )}
      </div>
      {/* "children" contains the resize handle */}
      {children}
    </div>
  );
});

export default React.memo(Widget);
