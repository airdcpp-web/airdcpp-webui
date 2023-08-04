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
import { parseActionMenuItemIds } from 'utils/MenuUtils';
import { useActionMenuItems } from 'components/action-menu/effects/useActionMenuItems';
import { EmptyDropdownContent } from 'components/semantic/EmptyDropdown';
import { OnShowRemoteMenuForm, useRemoteMenuItems } from '../effects/useRemoteMenuItems';

interface ActionMenuNestedProps<ItemDataT extends UI.ActionMenuItemDataValueType> {
  props: ActionMenuDecoratorProps<ItemDataT>;
  onShowForm: OnShowRemoteMenuForm;
  onClickAction: ActionClickHandler<ItemDataT>;
  onClickItem: (() => void) | undefined;
  menuBuilder: UI.ActionMenuComponentBuilder;
}

const ActionMenuNested = <ItemDataT extends UI.ActionMenuItemDataValueType>({
  props,
  onShowForm,
  onClickAction,
  onClickItem,
  menuBuilder,
}: ActionMenuNestedProps<ItemDataT>) => {
  const { getPropsArray, getItems } = useActionMenuItems(props);

  const propsArray = getPropsArray();
  const { getRemoteItems } = useRemoteMenuItems({
    selectedIds: propsArray
      .map((props) => props.itemData)
      .map((data) => parseActionMenuItemIds(data)),
    remoteMenuIds: propsArray.map((props) => props.remoteMenuId),
    entityId: propsArray.find((p) => p.entityId)?.entityId,
    onShowForm,
    nestingThreshold: props.remoteMenuNestingThreshold,
    onClickMenuItem: onClickItem,
  });

  const getAllMenuItems = () => {
    const remoteItems = getRemoteItems();
    const items = getItems(onClickAction, remoteItems, onClickItem);
    if (!items.length) {
      return <EmptyDropdownContent loading={!remoteItems} />;
    }

    return <>{menuBuilder(items)}</>;
  };

  return getAllMenuItems();
};

export interface ActionMenuDecoratorProps<
  ItemDataT extends UI.ActionMenuItemDataValueType,
> extends UI.ActionMenuData<ItemDataT> {
  remoteMenuId?: string;
  remoteMenuNestingThreshold?: number;
  className?: string;
  caption?: React.ReactNode;
  button?: boolean;
  children?: React.ReactElement<UI.ActionMenuData<any>> | false;
}

export interface ActionMenuDecoratorChildProps {
  children: (onClick?: UI.MenuItemClickHandler) => React.ReactNode;
}

export default function <
  DropdownComponentPropsT extends object,
  ItemDataT extends UI.ActionMenuItemDataValueType,
>(
  Component: React.ComponentType<ActionMenuDecoratorChildProps & DropdownComponentPropsT>,
  menuBuilder: UI.ActionMenuComponentBuilder,
) {
  type Props = ActionMenuDecoratorProps<ItemDataT> & DropdownComponentPropsT;

  const ActionMenuDecorator: React.FC<Props> = (props) => {
    const [formHandler, setFormHandler] = React.useState<MenuFormDialogProps | null>(
      null,
    );

    return (
      <>
        <ActionHandlerDecorator<ItemDataT>>
          {({ onClickAction }) => {
            const { actions, children, itemData, remoteMenuId, entityId, ...other } =
              props;

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
