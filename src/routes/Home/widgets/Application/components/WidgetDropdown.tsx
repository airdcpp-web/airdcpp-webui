import * as React from 'react';

import Dropdown from '@/components/semantic/Dropdown';
import MenuItemLink from '@/components/semantic/MenuItemLink';

import * as UI from '@/types/ui';

import { translateWidgetName } from '@/routes/Home/widgets/WidgetUtils';

import {
  ActionHandlerDecorator,
  ActionClickHandler,
} from '@/decorators/ActionHandlerDecorator';

import { WidgetActionModule, WidgetCreateAction } from '@/actions/ui/widget';
import { Widgets } from '../..';

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
        return Widgets.filter((widgetInfo) => !widgetInfo.alwaysShow).map((widgetInfo) =>
          getWidgetItem(widgetInfo, widgetT.plainT, onClickAction),
        );
      }}
    </ActionHandlerDecorator>
  </Dropdown>
);

export default WidgetDropdown;
