import * as React from 'react';

import * as UI from 'types/ui';

import {
  ActionClickHandler,
  ActionHandlerDecorator,
} from 'decorators/ActionHandlerDecorator';
import {
  MenuFormDialog,
  MenuFormDialogProps,
} from 'components/action-menu/MenuFormDialog';
import {
  ActionMenuDefinition,
  useActionMenuItems,
} from 'components/action-menu/effects/useActionMenuItems';
import { EmptyDropdownContent } from 'components/semantic/EmptyDropdown';
import { OnShowRemoteMenuForm, useRemoteMenuItems } from '../effects/useRemoteMenuItems';

export interface ActionMenuDecoratorProps<
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
> extends ActionMenuDefinition<ItemDataT, EntityT> {
  remoteMenuNestingThreshold?: number;
  className?: string;
  caption?: React.ReactNode;
  button?: boolean;
  children?: React.ReactElement<UI.ActionMenuData<any, any>> | false;
}

interface ActionMenuNestedProps<
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
> {
  props: ActionMenuDecoratorProps<ItemDataT, EntityT>;
  onShowForm: OnShowRemoteMenuForm;
  onClickAction: ActionClickHandler<ItemDataT, EntityT>;
  onClickItem: (() => void) | undefined;
  menuBuilder: UI.ActionMenuComponentBuilder;
}

const ActionMenuNested = <
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>({
  props,
  onShowForm,
  onClickAction,
  onClickItem,
  menuBuilder,
}: ActionMenuNestedProps<ItemDataT, EntityT>) => {
  const { getMenuDefinitionArray, getMenuItems } = useActionMenuItems<ItemDataT, EntityT>(
    props,
  );

  const definitionArray = getMenuDefinitionArray();
  const { getRemoteItems } = useRemoteMenuItems({
    definitionArray,
    onShowForm,
    nestingThreshold: props.remoteMenuNestingThreshold,
    onClickMenuItem: onClickItem,
  });

  const getAllMenuItems = () => {
    const remoteItems = getRemoteItems();
    const items = getMenuItems(onClickAction, remoteItems, onClickItem);
    if (!items.length) {
      return <EmptyDropdownContent loading={!remoteItems} />;
    }

    return <>{menuBuilder(items)}</>;
  };

  return getAllMenuItems();
};

/*const ActionMenuNested2 = <
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>({
  props,
  onClickAction,
  onClickItem,
  menuBuilder,
}: ActionMenuNestedProps<ItemDataT, EntityT>) => {
  const { getMenuItems } = useActionMenuItems<ItemDataT, EntityT>(props);

  const items = getMenuItems(onClickAction, null, onClickItem);
  if (!items.length) {
    return <EmptyDropdownContent />;
  }

  return <>{menuBuilder(items)}</>;
};*/

export interface ActionMenuDecoratorChildProps {
  children: (onClick?: UI.MenuItemClickHandler) => React.ReactNode;
}

export default function <
  DropdownComponentPropsT extends object,
  ItemDataT extends UI.ActionMenuItemDataValueType,
  EntityT extends UI.ActionMenuItemEntityValueType,
>(
  Component: React.ComponentType<ActionMenuDecoratorChildProps & DropdownComponentPropsT>,
  menuBuilder: UI.ActionMenuComponentBuilder,
) {
  type Props = ActionMenuDecoratorProps<ItemDataT, EntityT> & DropdownComponentPropsT;

  const ActionMenuDecorator: React.FC<Props> = (props) => {
    const [formHandler, setFormHandler] = React.useState<MenuFormDialogProps | null>(
      null,
    );

    return (
      <>
        <ActionHandlerDecorator<ItemDataT, EntityT>>
          {({ onClickAction }) => {
            const { actions, children, itemData, remoteMenuId, entity, ...other } = props;

            return (
              <Component
                {...(other as ActionMenuDecoratorChildProps & DropdownComponentPropsT)}
              >
                {(onClickItem) => (
                  <ActionMenuNested
                    props={props}
                    onShowForm={setFormHandler}
                    onClickAction={onClickAction}
                    onClickItem={onClickItem}
                    menuBuilder={menuBuilder}
                  />
                )}
              </Component>
            );
          }}
        </ActionHandlerDecorator>
        {!!formHandler && !!formHandler.fieldDefinitions && (
          <MenuFormDialog {...formHandler} onClose={() => setFormHandler(null)} />
        )}
      </>
    );
  };

  return ActionMenuDecorator;
}
