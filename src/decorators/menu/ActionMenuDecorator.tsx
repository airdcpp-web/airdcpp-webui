import * as React from 'react';
import invariant from 'invariant';
// import classNames from 'classnames';

import { actionFilter, actionAccess, toActionI18nKey } from 'utils/ActionUtils';
import MenuItemLink from 'components/semantic/MenuItemLink';
// import EmptyDropdown from 'components/semantic/EmptyDropdown';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { 
  ActionHandlerDecorator, ActionClickHandler, ActionData
} from 'decorators/ActionHandlerDecorator';
import { Trans } from 'react-i18next';
import { parseTranslationModules, toI18nKey } from 'utils/TranslationUtils';
import RemoteMenuDecorator from './RemoteMenuDecorator';
import Loader from 'components/semantic/Loader';
import { MenuFormDialog, MenuFormDialogProps } from 'components/menu/MenuFormDialog';

export type OnClickActionHandler = (actionId: string) => void;


export interface ActionMenuDecoratorProps<ItemDataT extends UI.ActionItemDataValueType> {
  remoteMenuId?: string;
  className?: string;
  caption?: React.ReactNode;
  button?: boolean;
  ids?: string[];
  actions: UI.ModuleActions<ItemDataT>;
  
  itemData?: UI.ActionItemDataType<ItemDataT>;
  entityId?: API.IdType;
}

type MenuItemClickHandler = () => void;

export interface ActionMenuDecoratorChildProps {
  children: (onClick?: MenuItemClickHandler) => React.ReactNode;
}

type FilterType<ItemDataT extends UI.ActionItemDataValueType> = (
  action: UI.ActionType<ItemDataT>, 
  itemData: ItemDataT
) => boolean;


const parseItemData = <ItemDataT extends UI.ActionItemDataValueType>(
  itemData: UI.ActionItemDataType<ItemDataT> | undefined
): ItemDataT | undefined => {
  return itemData instanceof Function ? itemData() : itemData;
};


const parseItemIds = <ItemDataT extends UI.ActionItemDataValueType>(
  itemData: UI.ActionItemDataType<ItemDataT> | undefined
): Array<UI.ActionIdType> => {
  const parsedItemData = parseItemData<ItemDataT>(itemData);
  return !!parsedItemData && (parsedItemData as UI.ActionObjectItemData).id ? 
    [ (parsedItemData as UI.ActionObjectItemData).id ] : 
    [];
};

// Returns true if the provided ID matches the specified filter
const filterItem = <ItemDataT extends UI.ActionItemDataValueType>(
  props: ActionMenuDecoratorProps<ItemDataT>, 
  filter: FilterType<ItemDataT>, 
  actionId: string
) => {
  const action = props.actions.actions[actionId];
  if (!action) {
    invariant(actionId === 'divider', 'No action for action ID: ' + actionId);
    return true;
  }

  return filter(action, parseItemData<ItemDataT>(props.itemData) as ItemDataT);
};

const isDivider = (id: string) => id.startsWith('divider');

// Get IDs matching the provided filter
const filterItems = <ItemDataT extends UI.ActionItemDataValueType>(
  props: ActionMenuDecoratorProps<ItemDataT>, 
  filter: FilterType<ItemDataT>, 
  actionIds: string[]
) => {
  let ids = actionIds.filter(id =>  filterItem(props, filter, id));
  if (!ids.length || ids.every(isDivider)) {
    return null;
  }

  return ids;
};

const filterExtraDividers = (ids: string[]) => {
  return ids.filter((item, pos) => {
    if (!isDivider(item)) {
      return true;
    }

    // The first or last element can't be a divider
    if (pos === 0 || pos === ids.length - 1) {
      return false;
    }

    // Check if the next element is also a divider 
    // (the last one would always be removed in the previous check)
    return !isDivider(ids[pos + 1]);
  });
};

interface MenuType<ItemDataT> {
  actionIds: string[];
  itemDataGetter: (() => ItemDataT);
  actions: UI.ModuleActions<ItemDataT>;
}

// Get IDs to display from the specified menu
const parseMenu = <ItemDataT extends UI.ActionItemDataValueType>(
  props: ActionMenuDecoratorProps<ItemDataT>, 
  hasPreviousMenuItems: boolean
): MenuType<ItemDataT> | string => {
  let ids: string[] | null;
  ids = props.ids || Object.keys(props.actions.actions).filter(id => {
    const action = props.actions.actions[id];
    return !action || action.displayName;
  });

  // Only return a single error for each menu
  // Note the filtering order (no-access will be preferred over filtered)
  ids = filterItems(props, actionAccess, ids);
  if (!ids) {
    return 'no-access';
  }

  ids = filterItems(props, actionFilter, ids);
  if (!ids) {
    return 'filtered';
  }

  // Remove unwanted dividers
  ids = filterExtraDividers(ids);

  // Always add a divider before submenus
  if (hasPreviousMenuItems) {
    ids = [ 'divider', ...ids ];
  }

  const ret: MenuType<ItemDataT> = {
    actionIds: ids,
    itemDataGetter: props.itemData instanceof Function ? props.itemData : () => props.itemData as ItemDataT,
    actions: props.actions,
  };

  return ret;
};

// Convert ID to menu link element
const getMenuItem = <ItemDataT extends UI.ActionItemDataValueType>(
  menu: MenuType<ItemDataT>, 
  menuIndex: number, 
  actionId: string, 
  itemIndex: number,
  onClickAction: ActionClickHandler<ItemDataT>,
) => {
  // A custom element
  if (typeof actionId !== 'string') {
    return actionId;
  }

  const action = menu.actions.actions[actionId];
  if (!action) {
    return (
      <div 
        key={ `divider${menuIndex}_${itemIndex}` } 
        className="ui divider"
      />
    );
  }

  const active = !action.checked ? false : action.checked(menu.itemDataGetter());
  const icon = !!action.checked ? (active ? 'checkmark' : '') : action.icon;
  return (
    <MenuItemLink 
      key={ actionId } 
      onClick={ () => {
        onClickAction({
          actionId,
          action, 
          itemData: menu.itemDataGetter(),
          moduleId: menu.actions.moduleId,
          subId: menu.actions.subId,
        });
      } }
      active={ active }
      icon={ icon }
    >
      <Trans
        i18nKey={ toActionI18nKey(action, parseTranslationModules(menu.actions.moduleId)) }
        defaults={ action.displayName }
      >
        { action.displayName }
      </Trans>
    </MenuItemLink>
  );
};

// This should be used only for constructed menus, not for id arrays
const hasLocalItems = <ItemDataT extends UI.ActionItemDataValueType>(
  id: string | MenuType<ItemDataT>
) => typeof id !== 'string';

interface State {
  formHandler: MenuFormDialogProps | null;
}

export default function <DropdownComponentPropsT extends object, ItemDataT extends UI.ActionItemDataValueType>(
  Component: React.ComponentType<ActionMenuDecoratorChildProps & DropdownComponentPropsT>
) {
  type Props = ActionMenuDecoratorProps<ItemDataT> & DropdownComponentPropsT;
  class ActionMenuDecorator extends React.PureComponent<Props, State> {
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
      items: React.ReactChild[], 
      menu: MenuType<ItemDataT>, 
      menuIndex: number,
    ) => {
      items.push(...menu.actionIds.map((actionId, actionIndex) => {
        return getMenuItem(menu as MenuType<ItemDataT>, menuIndex, actionId, actionIndex, onClickAction);
      }));

      return items;
    }

    getMenus = () => {
      return this.getPropsArray()
        .reduce(
          (reduced, cur) => {
            reduced.push(parseMenu(cur, !!reduced.length));
            return reduced;
          },
          [] as ReturnType<typeof parseMenu>[]
        );
    }

    state: State = {
      formHandler: null
    };

    getPropsArray = () => {
      let { children } = this.props;
      const ret: Array<ActionMenuDecoratorProps<ItemDataT>> = [ this.props ];
      if (children) {
        React.Children.map(children, child => {
          const id = (child as React.ReactElement<ActionMenuDecoratorProps<ItemDataT>>).props;
          ret.push(id);
        });
      }

      return ret;
    }

    getChildren = (
      onClickAction: ActionClickHandler<ItemDataT>,
      remoteMenus: Array<React.ReactChild[]> | null,
      onClickMenuItem: MenuItemClickHandler | undefined
    ): React.ReactNode => {
      const menus = this.getMenus();

      // Local items
      const children = menus
        .filter(hasLocalItems)
        .reduce(
          (reduced, menu, menuIndex) => {
            const onClickHandler = (action: ActionData<ItemDataT>) => {
              if (!!onClickMenuItem) {
                onClickMenuItem();
              }
              
              onClickAction(action);
            };

            return this.reduceLocalMenuItems(
              onClickHandler,
              reduced, 
              menu as MenuType<ItemDataT>, 
              menuIndex
            );
          }, 
          [] as React.ReactChild[]
        );

      // Remote items (insert after all local items so that the previous menu item positions won't change)
      if (remoteMenus) {
        remoteMenus.reduce(
          (reduced, remoteMenuItems) => {
            if (!!remoteMenuItems.length) {
              if (!!reduced.length) {
                reduced.push(
                  <div 
                    key="remote_divider" 
                    className="ui divider"
                  />
                );
              }
    
              reduced.push(...remoteMenuItems);
            }

            return reduced;
          }, 
          children
        );
      }

      if (!children.length) {
        return (
          <div className="item">
            { !remoteMenus ? (
              <Loader inline={ true } text=""/>
            ) : (
              <Trans
                i18nKey={ toI18nKey('noActionsAvailable', UI.Modules.COMMON) }
              >
                No actions available
              </Trans>
            ) }
          </div>
        );
      }

      return children;
    }

    onShowForm = (formHandler: MenuFormDialogProps) => {
      this.setState({
        formHandler
      });
    }

    onCloseForm = () => {
      this.setState({
        formHandler: null
      });
    }

    render() {
      const { formHandler } = this.state;
      return (
        <>
          <ActionHandlerDecorator<ItemDataT>>
            { ({ onClickAction }) => {
              let { actions, children, itemData, remoteMenuId, entityId, ...other } = this.props;

              /*const menus = this.getMenus();

              // Are there any items to show?
              if (!menus.some(notError)) {
                if (this.props.button) {
                  return null;
                }

                const dropdownClassName = classNames(
                  { 'no-access': menus.indexOf('no-access') !== -1 },
                  { 'filtered': menus.indexOf('filtered') !== -1 },
                  this.props.className,
                );

                return (
                  <EmptyDropdown
                    caption={ this.props.caption }
                    className={ dropdownClassName }
                  />
                );
              }*/

              return (
                <Component 
                  { ...other as ActionMenuDecoratorChildProps & DropdownComponentPropsT }
                >
                  { (onClickMenuItem?: MenuItemClickHandler) => (
                    <RemoteMenuDecorator
                      selectedIds={ this.getPropsArray()
                        .map(props => props.itemData)
                        .map(data => parseItemIds(data)) }
                      remoteMenuIds={ this.getPropsArray() 
                        .map(props => props.remoteMenuId)
                      }
                      onClickMenuItem={ onClickMenuItem }
                      entityId={ this.getPropsArray().find(p => p.entityId) ? 
                        this.getPropsArray().find(p => p.entityId)?.entityId : undefined 
                      }
                      onShowForm={ this.onShowForm }
                    >
                      { remoteMenus => this.getChildren(onClickAction, remoteMenus, onClickMenuItem) }
                    </RemoteMenuDecorator> 
                  ) }
                </Component>
              );
            } }
          </ActionHandlerDecorator>
          { !!formHandler && !!formHandler.fieldDefinitions && (
            <MenuFormDialog
              { ...formHandler }
              onClose={ this.onCloseForm }
            />
          ) }
        </>
      );
    }
  }

  return ActionMenuDecorator;
  //return ActionHandlerDecorator<ActionMenuDecoratorProps<ItemDataT> & DropdownComponentPropsT>(ActionMenuDecorator);
}
