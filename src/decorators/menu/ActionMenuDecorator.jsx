import PropTypes from 'prop-types';
import React from 'react';
import invariant from 'invariant';
import classNames from 'classnames';

import { actionFilter, actionAccess } from 'utils/ActionUtils';
import { MenuItemLink } from 'components/semantic/MenuItem';
import EmptyDropdown from 'components/semantic/EmptyDropdown';


// Returns true if the provided ID matches the specified filter
const filterItem = (props, filter, actionId) => {
  const action = props.actions[actionId];
  if (!action) {
    invariant(actionId === 'divider', 'No action for action ID: ' + actionId);
    return true;
  }

  return filter(action, props.itemDataGetter ? props.itemDataGetter() : props.itemData);
};

// Get IDs matching the provided filter
const filterItems = (props, filter, actionIds) => {
  let ids = actionIds.filter(filterItem.bind(this, props, filter));
  if (ids.length === 0 || ids.every(id => id === 'divider')) {
    return null;
  }

  return ids;
};

const filterExtraDividers = (ids) => {
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

// Get IDs to display from the specified menu
const parseMenu = (props, hasPreviousMenuItems) => {
  let { ids } = props;
  if (!ids) {
    ids = Object.keys(props.actions).filter(id => {
      return id === 'divider' || props.actions[id].displayName;
    });
  }

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
    itemDataGetter: props.itemDataGetter ? props.itemDataGetter : _ => props.itemData,
    actions: props.actions,
  };
};

// Convert ID to menu link element
const getMenuItem = (menu, menuIndex, actionId, itemIndex, routerLocation) => {
  if (actionId === 'divider') {
    return <div key={ 'divider' + menuIndex + '_' + itemIndex } className="ui divider"/>;
  }

  // A custom element
  if (typeof actionId !== 'string') {
    return actionId;
  }

  const action = menu.actions[actionId];
  return (
    <MenuItemLink 
      key={ actionId } 
      onClick={ () => action(menu.itemDataGetter(), routerLocation) }
      icon={ action.icon }
    >
      { action.displayName }
    </MenuItemLink>
  );
};

// This should be used only for constructed menus, not for id arrays
const notError = id => typeof id !== 'string';

export default function (Component) {
  class ActionMenu extends React.PureComponent {
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
    reduceMenuItems = (items, menu, menuIndex) => {
      items.push(...menu.actionIds.map((actionId, actionIndex) => {
        return getMenuItem(menu, menuIndex, actionId, actionIndex, this.context.router.route.location);
      }));
      return items;
    };

    getMenus = () => {
			let { ids, actions, children, ...other } = this.props; // eslint-disable-line

      const menus = [ parseMenu(this.props) ];
      if (children) {
        React.Children.map(children, child => {
          menus.push(parseMenu(child.props, notError(menus[0])));
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
			let { ids, actions, children, itemData, itemDataGetter, ...other } = this.props; // eslint-disable-line

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

  return ActionMenu;
}
