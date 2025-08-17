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
  const { item, id } = menuItem;
  if (!item) {
    return <div key={`divider-${index}`} className="ui divider" />;
  }

  if (item.children) {
    const { caption, children, ...other } = item;
    return (
      <MenuItemLink key={id} submenuIcon="dropdown" {...other}>
        <span className="text">{caption}</span>
        {buildChildMenu(caption, children)}
      </MenuItemLink>
    );
  }

  return (
    <MenuItemLink key={id} {...item}>
      {item.caption}
    </MenuItemLink>
  );
};

export const buildMenu: UI.ActionMenuComponentBuilder = (items) =>
  items.map(buildMenuItem);
