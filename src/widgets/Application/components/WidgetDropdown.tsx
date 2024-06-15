import * as React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import MenuItemLink from 'components/semantic/MenuItemLink';

import WidgetStore from 'stores/WidgetStore';

import * as UI from 'types/ui';
import { translateWidgetName } from 'utils/WidgetUtils';
import {
  ActionHandlerDecorator,
  ActionClickHandler,
} from 'decorators/ActionHandlerDecorator';
import { WidgetActionModule, WidgetCreateAction } from 'actions/ui/widget';

const getWidgetItem = (
  widgetInfo: UI.Widget,
  t: UI.TranslateF,
  onClickAction: ActionClickHandler<UI.Widget>,
) => {
  return (
    <MenuItemLink
      key={widgetInfo.typeId}
      onClick={() =>
        onClickAction({
          action: WidgetCreateAction,
          itemData: widgetInfo,
          moduleData: WidgetActionModule,
          entity: undefined,
        })
      }
      icon={widgetInfo.icon}
    >
      {translateWidgetName(widgetInfo, t)}
    </MenuItemLink>
  );
};

export type WidgetDropdownProps = Pick<UI.WidgetProps, 'componentId' | 'widgetT'>;

const WidgetDropdown: React.FC<WidgetDropdownProps> = ({ componentId, widgetT }) => (
  <Dropdown
    caption={widgetT.translate('Add widget...')}
    className="create-widget"
    button={true}
    contextElement={`.${componentId}`}
  >
    <ActionHandlerDecorator<UI.Widget>>
      {({ onClickAction }) => {
        return WidgetStore.widgets
          .filter((widgetInfo) => !widgetInfo.alwaysShow)
          .map((widgetInfo) => getWidgetItem(widgetInfo, widgetT.plainT, onClickAction));
      }}
    </ActionHandlerDecorator>
  </Dropdown>
);

export default WidgetDropdown;

/*

import * as React from 'react';

import Dropdown from 'components/semantic/Dropdown';

import WidgetActions from 'actions/ui/WidgetActions';
import WidgetStore from 'stores/WidgetStore';

import * as UI from 'types/ui';
import { translateWidgetName } from 'utils/WidgetUtils';
import {
  ActionHandlerDecorator,
  ActionClickHandler,
} from 'decorators/ActionHandlerDecorator';
import { ActionMenuItem } from 'types/ui';

const toMenuItem = (
  widgetInfo: UI.Widget,
  t: UI.TranslateF,
  onClickAction: ActionClickHandler<UI.Widget>
): ActionMenuItem => {
  return {
    id: widgetInfo.typeId,
    item: {
      onClick: () =>
        onClickAction({
          actionId: 'create',
          action: WidgetActions.create.actions.create!,
          itemData: widgetInfo,
          moduleId: WidgetActions.create.moduleId,
        }),
      icon: widgetInfo.icon,
      children: translateWidgetName(widgetInfo, t),
    },
  };
};

export type WidgetDropdownProps = Pick<UI.WidgetProps, 'componentId' | 'widgetT'>;

const WidgetDropdown: React.FC<WidgetDropdownProps> = ({ componentId, widgetT }) => (
  <ActionHandlerDecorator<UI.Widget>>
    {({ onClickAction }) => (
      <Dropdown
        caption={widgetT.translate('Add widget...')}
        className="create-widget"
        button={true}
        contextElement={`.${componentId}`}
        items={WidgetStore.widgets
          .filter((widgetInfo) => !widgetInfo.alwaysShow)
          .map((widgetInfo) => toMenuItem(widgetInfo, widgetT.plainT, onClickAction))}
      />
    )}
  </ActionHandlerDecorator>
);

export default WidgetDropdown;


*/
