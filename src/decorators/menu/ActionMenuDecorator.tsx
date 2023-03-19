import * as React from 'react';

import { toActionI18nKey } from 'utils/ActionUtils';
import MenuItemLink from 'components/semantic/MenuItemLink';

import * as UI from 'types/ui';

import {
  ActionHandlerDecorator,
  ActionClickHandler,
  ActionData,
} from 'decorators/ActionHandlerDecorator';
import { Trans } from 'react-i18next';
import { parseTranslationModules, toI18nKey } from 'utils/TranslationUtils';
import RemoteMenuDecorator from './RemoteMenuDecorator';
import Loader from 'components/semantic/Loader';
import { MenuFormDialog, MenuFormDialogProps } from 'components/menu/MenuFormDialog';
import { parseActionMenu, parseActionMenuItemIds } from 'utils/MenuUtils';

// Convert ID to menu link element
const getMenuItem = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  menu: UI.ActionMenuType<ItemDataT>,
  menuIndex: number,
  actionId: string,
  itemIndex: number,
  onClickAction: ActionClickHandler<ItemDataT>
) => {
  const action = menu.actions.actions[actionId];
  if (!action) {
    return <div key={`divider${menuIndex}_${itemIndex}`} className="ui divider" />;
  }

  const active = !action.checked ? false : action.checked(menu.itemDataGetter());
  const icon = !!action.checked ? (active ? 'checkmark' : '') : action.icon;
  return (
    <MenuItemLink
      key={actionId}
      onClick={() => {
        onClickAction({
          actionId,
          action,
          itemData: menu.itemDataGetter(),
          moduleId: menu.actions.moduleId,
          subId: menu.actions.subId,
        });
      }}
      active={active}
      icon={icon}
    >
      <Trans
        i18nKey={toActionI18nKey(action, parseTranslationModules(menu.actions.moduleId))}
        defaults={action.displayName}
      >
        {action.displayName}
      </Trans>
    </MenuItemLink>
  );
};

// This should be used only for constructed menus, not for id arrays
const hasLocalItems = <ItemDataT extends UI.ActionMenuItemDataValueType>(
  id: string | UI.ActionMenuType<ItemDataT>
) => typeof id !== 'string';

interface State {
  formHandler: MenuFormDialogProps | null;
}

export interface ActionMenuDecoratorProps<
  ItemDataT extends UI.ActionMenuItemDataValueType
> extends UI.ActionMenuData<ItemDataT> {
  remoteMenuId?: string;
  className?: string;
  caption?: React.ReactNode;
  button?: boolean;
}

export interface ActionMenuDecoratorChildProps {
  children: (onClick?: UI.MenuItemClickHandler) => React.ReactNode;
}

export default function <
  DropdownComponentPropsT extends object,
  ItemDataT extends UI.ActionMenuItemDataValueType
>(
  Component: React.ComponentType<ActionMenuDecoratorChildProps & DropdownComponentPropsT>
) {
  type Props = ActionMenuDecoratorProps<ItemDataT> & DropdownComponentPropsT;
  class ActionMenuDecorator extends React.PureComponent<
    React.PropsWithChildren<Props>,
    State
  > {
    /*static propTypes = {

      // Item to be passed to the actions
      itemData: PropTypes.any,

      itemDataGetter: PropTypes.func,

      // Menu item actions
      actions: PropTypes.object.isRequired,

      // Action ids to filter from all actions
      ids: PropTypes.array,

      // Use button style for the trigger
      button: PropTypes.bool,

      caption: PropTypes.node,
    };*/

    // Reduce menus to an array of DropdownItems
    reduceLocalMenuItems = (
      onClickAction: ActionClickHandler,
      items: JSX.Element[],
      menu: UI.ActionMenuType<ItemDataT>,
      menuIndex: number
    ) => {
      items.push(
        ...menu.actionIds.map((actionId, actionIndex) => {
          return getMenuItem(
            menu as UI.ActionMenuType<ItemDataT>,
            menuIndex,
            actionId,
            actionIndex,
            onClickAction
          );
        })
      );

      return items;
    };

    getMenus = () => {
      return this.getPropsArray().reduce((reduced, cur) => {
        reduced.push(parseActionMenu(cur, !!reduced.length));
        return reduced;
      }, [] as ReturnType<typeof parseActionMenu>[]);
    };

    state: State = {
      formHandler: null,
    };

    getPropsArray = () => {
      const { children } = this.props;
      const ret: Array<ActionMenuDecoratorProps<ItemDataT>> = [this.props];
      if (children) {
        React.Children.map(children, (child) => {
          const id = (child as React.ReactElement<ActionMenuDecoratorProps<ItemDataT>>)
            .props;
          ret.push(id);
        });
      }

      return ret;
    };

    getChildren = (
      onClickAction: ActionClickHandler<ItemDataT>,
      remoteMenus: Array<JSX.Element[]> | null,
      onClickMenuItem: UI.MenuItemClickHandler | undefined
    ): React.ReactNode => {
      const menus = this.getMenus();

      // Local items
      const children = menus.filter(hasLocalItems).reduce((reduced, menu, menuIndex) => {
        const onClickHandler = (action: ActionData<ItemDataT>) => {
          if (!!onClickMenuItem) {
            onClickMenuItem();
          }

          onClickAction(action);
        };

        return this.reduceLocalMenuItems(
          onClickHandler,
          reduced,
          menu as UI.ActionMenuType<ItemDataT>,
          menuIndex
        );
      }, []);

      // Remote items (insert after all local items so that the previous menu item positions won't change)
      if (remoteMenus) {
        remoteMenus.reduce((reduced, remoteMenuItems) => {
          if (!!remoteMenuItems.length) {
            if (!!reduced.length) {
              reduced.push(<div key="remote_divider" className="ui divider" />);
            }

            reduced.push(...remoteMenuItems);
          }

          return reduced;
        }, children);
      }

      // Anything to show?
      if (!children.length) {
        return (
          <div className="item">
            {!remoteMenus ? (
              <Loader inline={true} text="" />
            ) : (
              <Trans i18nKey={toI18nKey('noActionsAvailable', UI.Modules.COMMON)}>
                No actions available
              </Trans>
            )}
          </div>
        );
      }

      return children;
    };

    onShowForm = (formHandler: MenuFormDialogProps) => {
      this.setState({
        formHandler,
      });
    };

    onCloseForm = () => {
      this.setState({
        formHandler: null,
      });
    };

    render() {
      const { formHandler } = this.state;
      return (
        <>
          <ActionHandlerDecorator<ItemDataT>>
            {({ onClickAction }) => {
              const { actions, children, itemData, remoteMenuId, entityId, ...other } =
                this.props;
              return (
                <Component
                  {...(other as ActionMenuDecoratorChildProps & DropdownComponentPropsT)}
                >
                  {(onClickMenuItem) => (
                    <RemoteMenuDecorator
                      selectedIds={this.getPropsArray()
                        .map((props) => props.itemData)
                        .map((data) => parseActionMenuItemIds(data))}
                      remoteMenuIds={this.getPropsArray().map(
                        (props) => props.remoteMenuId
                      )}
                      onClickMenuItem={onClickMenuItem}
                      entityId={
                        this.getPropsArray().find((p) => p.entityId)
                          ? this.getPropsArray().find((p) => p.entityId)?.entityId
                          : undefined
                      }
                      onShowForm={this.onShowForm}
                    >
                      {(remoteMenus) =>
                        this.getChildren(onClickAction, remoteMenus, onClickMenuItem)
                      }
                    </RemoteMenuDecorator>
                  )}
                </Component>
              );
            }}
          </ActionHandlerDecorator>
          {!!formHandler && !!formHandler.fieldDefinitions && (
            <MenuFormDialog {...formHandler} onClose={this.onCloseForm} />
          )}
        </>
      );
    }
  }

  return ActionMenuDecorator;
  //return ActionHandlerDecorator<ActionMenuDecoratorProps<ItemDataT> & DropdownComponentPropsT>(ActionMenuDecorator);
}
