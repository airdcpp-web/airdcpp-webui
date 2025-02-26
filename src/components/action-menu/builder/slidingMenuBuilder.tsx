import * as React from 'react';

import * as UI from '@/types/ui';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Icon, { IconType } from '@/components/semantic/Icon';
import MenuItemLink from '@/components/semantic/MenuItemLink';
import LinkButton from '@/components/semantic/LinkButton';

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
  const { id, item, children: subMenu } = menuItem;
  if (!item) {
    return <div key={`divider-${index}`} className="ui divider" />;
  }

  if (subMenu) {
    const { children, ...other } = item;
    return (
      <MenuItemLink
        {...other}
        key={id}
        onClick={() => {
          showSubmenu(menuItem);
        }}
      >
        {children}
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
    />
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
          timeout={{ enter: 200, exit: 200 }}
        >
          <div ref={ref} className="ui text menu vertical table-items">
            {activeSubmenu ? (
              <>
                <LinkButton
                  className="header item"
                  onClick={() => {
                    setActiveSubmenu(null);
                  }}
                  caption={
                    <>
                      <Icon icon="chevron left" />
                      {activeSubmenu.item!.children}
                    </>
                  }
                />
                {buildMenuList(activeSubmenu.children!, hideMenu, setActiveSubmenu)}
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
