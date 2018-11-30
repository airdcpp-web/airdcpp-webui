import React from 'react';
import invariant from 'invariant';
import classNames from 'classnames';

import { actionFilter, actionAccess } from 'utils/ActionUtils';
import MenuItemLink from 'components/semantic/MenuItemLink';
import EmptyDropdown from 'components/semantic/EmptyDropdown';
import { Location } from 'history';

import * as UI from 'types/ui';
import { 
  ActionHandlerDecorator, ActionHandlerDecoratorChildProps, ActionClickHandler
} from 'decorators/ActionHandlerDecorator';

export type OnClickActionHandler = (actionId: string) => void;

export interface ActionMenuDecoratorProps<ItemDataT extends UI.ActionItemDataValueType> {
  className?: string;
  caption?: React.ReactNode;
  button?: boolean;
  ids?: string[];
  actions: UI.ActionListType<ItemDataT>;
  
  itemData?: UI.ActionItemDataType<ItemDataT>;
  onClickAction?: OnClickActionHandler;
}

export interface ActionMenuDecoratorChildProps {
  children: () => React.ReactNode;
}

type FilterType = (action: UI.ActionType, itemData: UI.ActionItemDataValueType | undefined) => boolean;


const parseItemData = <ItemDataT extends UI.ActionItemDataValueType>(
  itemData?: UI.ActionItemDataType<ItemDataT>
): ItemDataT | undefined => {
  return itemData instanceof Function ? itemData() : itemData;
};

// Returns true if the provided ID matches the specified filter
const filterItem = <ItemDataT extends UI.ActionItemDataValueType>(
  props: ActionMenuDecoratorProps<ItemDataT>, 
  filter: FilterType, 
  actionId: string
) => {
  const action = props.actions[actionId];
  if (!action) {
    invariant(actionId === 'divider', 'No action for action ID: ' + actionId);
    return true;
  }

  return filter(action, parseItemData<ItemDataT>(props.itemData));
};

// Get IDs matching the provided filter
const filterItems = <ItemDataT extends UI.ActionItemDataValueType>(
  props: ActionMenuDecoratorProps<ItemDataT>, 
  filter: FilterType, 
  actionIds: string[]
) => {
  let ids = actionIds.filter(id =>  filterItem(props, filter, id));
  if (!ids.length || ids.every(id => id === 'divider')) {
    return null;
  }

  return ids;
};

const filterExtraDividers = (ids: string[]) => {
  return ids.filter((item, pos) => {
    if (item !== 'divider') {
      return true;
    }

    // The first or last element can't be a divider
    if (pos === 0 || pos === ids.length - 1) {
      return false;
    }

    // Check if the next element is also a divider 
    // (the last one would always be removed in the previous check)
    return ids[pos + 1] !== 'divider';
  });
};

interface MenuType<ItemDataT> {
  actionIds: string[];
  itemDataGetter: (() => ItemDataT | undefined);
  actions: UI.ActionListType<ItemDataT>;
}

// Get IDs to display from the specified menu
const parseMenu = <ItemDataT extends UI.ActionItemDataValueType>(
  props: ActionMenuDecoratorProps<ItemDataT>, 
  hasPreviousMenuItems: boolean
): MenuType<ItemDataT> | string => {
  let ids: string[] | null;
  ids = props.ids || Object.keys(props.actions).filter(id => {
    return id === 'divider' || props.actions[id].displayName;
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

  return {
    actionIds: ids,
    itemDataGetter: props.itemData instanceof Function ? props.itemData : () => props.itemData,
    actions: props.actions,
  } as MenuType<ItemDataT>;
};

// Convert ID to menu link element
const getMenuItem = <ItemDataT extends UI.ActionItemDataValueType>(
  menu: MenuType<ItemDataT>, 
  menuIndex: number, 
  actionId: string, 
  itemIndex: number, 
  location: Location, 
  onClickAction: ActionClickHandler<ItemDataT>
) => {
  if (actionId === 'divider') {
    return (
      <div 
        key={ `divider${menuIndex}_${itemIndex}` } 
        className="ui divider"
      />
    );
  }

  // A custom element
  if (typeof actionId !== 'string') {
    return actionId;
  }

  const action = menu.actions[actionId];
  return (
    <MenuItemLink 
      key={ actionId } 
      onClick={ () => {
        onClickAction({
          actionId,
          action, 
          itemData: menu.itemDataGetter()
        });

        //if (!!closeModal && isSidebarAction(actionId)) {
        //  closeModal();
        //}

        //setTimeout(() => action(menu.itemDataGetter(), location));
        //action(menu.itemDataGetter(), location);
      } }
      icon={ action.icon }
    >
      { action.displayName }
    </MenuItemLink>
  );
};

// This should be used only for constructed menus, not for id arrays
const notError = <ItemDataT extends UI.ActionItemDataValueType>(
  id: string | MenuType<ItemDataT>
) => typeof id !== 'string';

export default function <DropdownComponentPropsT extends object, ItemDataT extends UI.ActionItemDataValueType>(
  Component: React.ComponentType<ActionMenuDecoratorChildProps & DropdownComponentPropsT>
) {
  type Props = ActionMenuDecoratorProps<ItemDataT> & DropdownComponentPropsT & ActionHandlerDecoratorChildProps;
  class ActionMenuDecorator extends React.PureComponent<Props> {
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
    reduceMenuItems = (items: React.ReactChild[], menu: MenuType<ItemDataT>, menuIndex: number) => {
      const { location } = this.props;
      const { onClickAction } = this.props;

      items.push(...menu.actionIds.map((actionId, actionIndex) => {
        return getMenuItem(menu, menuIndex, actionId, actionIndex, location, onClickAction);
      }));

      return items;
    }

    getMenus = () => {
      let { children } = this.props; // eslint-disable-line

      const menus = [ parseMenu(this.props, false) ];
      if (children) {
        React.Children.map(children, child => {
          menus.push(
            parseMenu(
              (child as React.ReactElement<ActionMenuDecoratorProps<ItemDataT>>).props, 
              notError(menus[0])
            )
          );
        });
      }

      return menus;
    }

    getChildren = () => {
      const menus = this.getMenus();
      return menus
        .filter(notError)
        .reduce(this.reduceMenuItems, []);
    }

    render() {
      let { ids, actions, children, itemData, ...other } = this.props as any; // eslint-disable-line

      const menus = this.getMenus();

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
      }

      return (
        <Component { ...other }>
          { this.getChildren }
        </Component>
      );
    }
  }

  return ActionHandlerDecorator<ActionMenuDecoratorProps<ItemDataT> & DropdownComponentPropsT>(ActionMenuDecorator);
}
