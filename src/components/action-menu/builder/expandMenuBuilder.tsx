import classNames from 'classnames';

import * as UI from '@/types/ui';
import MenuItemLink from '@/components/semantic/MenuItemLink';

// Convert action menu items to React components for regular Dropdown component

const buildChildMenu = (
  label: string,
  items: UI.ActionMenuItem[],
  className?: string,
) => {
  return (
    <div
      className={classNames('menu', 'upward', className)}
      role="menu"
      aria-label={label}
    >
      {items.map(buildMenuItem)}
    </div>
  );
};

const buildMenuItem = (menuItem: UI.ActionMenuItem, index: number) => {
  const { item, id, children: childMenu } = menuItem;
  if (!item) {
    return <div key={`divider-${index}`} className="ui divider" />;
  }

  if (childMenu) {
    const { children, ...other } = item;
    return (
      <MenuItemLink key={id} submenuIcon="dropdown" {...other}>
        <span className="text">{children}</span>
        {buildChildMenu(children, childMenu)}
      </MenuItemLink>
    );
  }

  return <MenuItemLink key={id} {...item} />;
};

export const buildMenu: UI.ActionMenuComponentBuilder = (items) =>
  items.map(buildMenuItem);
