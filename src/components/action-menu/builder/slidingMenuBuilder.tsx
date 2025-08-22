import * as React from 'react';

import * as UI from '@/types/ui';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Icon, { IconType } from '@/components/semantic/Icon';
import MenuItemLink from '@/components/semantic/MenuItemLink';
import { AnimationConstants } from '@/constants/UIConstants';

// Convert action menu items to React components where the submenus will be shown in the original layout with animation
// Suitable for TableDropdown

export type DropdownCloseHandler = () => void;
export type SubmenuSelectHandler = (menu: UI.ActionMenuItem) => void;

export interface TableDropdownProps {
  caption: React.ReactNode;
  linkCaption?: boolean;
  className?: string;
  triggerIcon?: IconType;
  items: () => UI.ActionMenuItem[];
  popupSettings?: SemanticUI.PopupSettings;
  position?: string;
}

const buildMenuItem = (
  menuItem: UI.ActionMenuItem,
  index: number,
  hideMenu: DropdownCloseHandler | undefined,
  showSubmenu: SubmenuSelectHandler,
) => {
  const { id, item } = menuItem;
  if (!item) {
    return <div key={`divider-${index}`} className="ui divider" />;
  }

  if (item.children) {
    const { caption, ...other } = item;
    return (
      <MenuItemLink
        {...other}
        key={id}
        onClick={() => {
          showSubmenu(menuItem);
        }}
      >
        {caption}
        <Icon icon="right chevron" />
      </MenuItemLink>
    );
  }

  const { onClick, ...other } = item;
  return (
    <MenuItemLink
      key={id}
      onClick={(evt) => {
        if (hideMenu) {
          hideMenu();
        }
        onClick(evt);
      }}
      {...other}
    >
      {item.caption}
    </MenuItemLink>
  );
};

const buildMenuList = (
  items: UI.ActionMenuItem[],
  hideMenu: DropdownCloseHandler | undefined,
  showSubmenu: SubmenuSelectHandler,
) => {
  return (
    <>{items.map((item, index) => buildMenuItem(item, index, hideMenu, showSubmenu))}</>
  );
};

const findParent = (
  child: UI.ActionMenuItem,
  items: UI.ActionMenuItem[],
): UI.ActionMenuItem | null => {
  for (const item of items) {
    const children = item.item?.children;
    if (children && children.includes(child)) {
      return item;
    }

    const parent = findParent(child, children || []);
    if (parent) {
      return parent;
    }
  }
  return null;
};

interface NestedMenuProps {
  items: UI.ActionMenuItem[];
  hideMenu: DropdownCloseHandler | undefined;
}

const NestedMenu = ({ items, hideMenu }: NestedMenuProps) => {
  const [activeSubmenu, setActiveSubmenu] = React.useState<UI.ActionMenuItem | null>(
    null,
  );

  const nodeRefMain = React.useRef(null);
  const nodeRefSub = React.useRef(null);

  const ref = activeSubmenu ? nodeRefSub : nodeRefMain;
  const className = activeSubmenu ? 'submenu-transition' : 'mainmenu-transition';
  return (
    <div style={{ display: 'flex' }}>
      <TransitionGroup component={null}>
        <CSSTransition
          nodeRef={ref}
          key={className}
          classNames={className}
          timeout={{
            enter: AnimationConstants.dropdown,
            exit: AnimationConstants.dropdown,
          }}
        >
          <div
            ref={ref}
            className="ui text menu vertical table-items"
            role="menu"
            aria-label={activeSubmenu ? activeSubmenu.item!.caption : undefined}
          >
            {activeSubmenu ? (
              <>
                <div
                  className="header item"
                  onClick={() => {
                    setActiveSubmenu(findParent(activeSubmenu, items));
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <Icon icon="chevron left" />
                  {activeSubmenu.item!.caption}
                </div>
                {buildMenuList(activeSubmenu.item!.children!, hideMenu, setActiveSubmenu)}
              </>
            ) : (
              <>{buildMenuList(items, hideMenu, setActiveSubmenu)}</>
            )}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export const buildMenu: UI.ActionMenuComponentBuilder = (items, hideMenu) => (
  <NestedMenu items={items} hideMenu={hideMenu} />
);
