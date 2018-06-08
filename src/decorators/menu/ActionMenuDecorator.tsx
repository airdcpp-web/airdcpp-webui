import PropTypes from 'prop-types';
import React from 'react';
import invariant from 'invariant';
import classNames from 'classnames';

import { actionFilter, actionAccess } from 'utils/ActionUtils';
import MenuItemLink from 'components/semantic/MenuItemLink';
import EmptyDropdown from 'components/semantic/EmptyDropdown';
import { Location } from 'history';


export interface ActionType {

}

type ItemDataType = (() => object | string | number) | object | string | number;

export interface ActionMenuDecoratorProps {
  className?: string;
  caption?: React.ReactNode;
  button?: boolean;
  ids?: string[];
  actions: ActionType[];
  
  itemData: ItemDataType;
}

export interface ActionMenuDecoratorChildProps {
  children: () => React.ReactNode;
}

type FilterType = (action: ActionType, itemData: any) => boolean;


const parseItemData = (itemData: ItemDataType) => typeof itemData === 'function' ? itemData() : itemData;

// Returns true if the provided ID matches the specified filter
const filterItem = (props: ActionMenuDecoratorProps, filter: FilterType, actionId: string) => {
  const action = props.actions[actionId];
  if (!action) {
    invariant(actionId === 'divider', 'No action for action ID: ' + actionId);
    return true;
  }

  return filter(action, parseItemData(props.itemData));
};

// Get IDs matching the provided filter
const filterItems = (props: ActionMenuDecoratorProps, filter: FilterType, actionIds: string[]) => {
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
    return ids[pos+1] !== 'divider';
  });
};

interface MenuType {
  actionIds: string[];
  itemDataGetter: () => any;
  actions: ActionType[];
}

// Get IDs to display from the specified menu
const parseMenu = (props: ActionMenuDecoratorProps, hasPreviousMenuItems: boolean): MenuType | string => {
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
    itemDataGetter: typeof props.itemData === 'function' ? props.itemData : () => props.itemData,
    actions: props.actions,
  };
};

// Convert ID to menu link element
const getMenuItem = (menu: MenuType, menuIndex: number, actionId: string, itemIndex: number, location: Location) => {
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
      onClick={ () => action(menu.itemDataGetter(), location) }
      icon={ action.icon }
    >
      { action.displayName }
    </MenuItemLink>
  );
};

// This should be used only for constructed menus, not for id arrays
const notError = (id: any) => typeof id !== 'string';

export default function <DropdownComponentPropsT extends object>(
  Component: React.ComponentType<ActionMenuDecoratorChildProps & DropdownComponentPropsT>
) {
  class ActionMenuDecorator extends React.PureComponent<ActionMenuDecoratorProps & DropdownComponentPropsT> {
    static propTypes = {

      /**
			 * Item to be passed to the actions
			 */
      itemData: PropTypes.any,

      itemDataGetter: PropTypes.func,

      /**
			 * Menu item actions
			 */
      actions: PropTypes.object.isRequired,

      /**
			 * Action ids to filter from all actions
			 */
      ids: PropTypes.array,

      /**
			 * Use button style for the trigger
			 */
      button: PropTypes.bool,

      caption: PropTypes.node,
    };

    static contextTypes = {
      router: PropTypes.object.isRequired,
    };

    // Reduce menus to an array of DropdownItems
    reduceMenuItems = (items: React.ReactChild[], menu: MenuType, menuIndex: number) => {
      items.push(...menu.actionIds.map((actionId, actionIndex) => {
        return getMenuItem(menu, menuIndex, actionId, actionIndex, this.context.router.route.location);
      }));

      return items;
    };

    getMenus = () => {
			let { children } = this.props; // eslint-disable-line

      const menus = [ parseMenu(this.props, false) ];
      if (children) {
        React.Children.map(children, child => {
          menus.push(parseMenu((child as any).props, notError(menus[0])));
        });
      }

      return menus;
    };

    getChildren = () => {
      const menus = this.getMenus();
      return menus
        .filter(notError)
        .reduce(this.reduceMenuItems, []);
    };

    render() {
			let { ids, actions, children, itemData, itemDataGetter, ...other } = this.props as any; // eslint-disable-line

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

  return ActionMenuDecorator;
}
