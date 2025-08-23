import { UserEvent } from '@testing-library/user-event';
import { BaseRenderResult } from '../render/test-renderers';
import { waitFor } from '@testing-library/dom';
import { expect } from 'vitest';

export const waitMenuOpen = async ({ queryByRole }: BaseRenderResult, label?: string) => {
  await waitFor(() => {
    const menu = queryByRole('menu', { name: label });
    expect(menu).toBeVisible();
    expect(menu).not.toHaveClass('hidden');
  });
};

export const clickNavigationMenuItem = async (
  menuItemLabel: string,
  renderResult: BaseRenderResult & { userEvent: UserEvent },
) => {
  const { getByRole, userEvent } = renderResult;
  await userEvent.click(getByRole('link', { name: menuItemLabel }));
};

export const clickMenuItem = async (
  menuItemLabel: string,
  renderResult: BaseRenderResult & { userEvent: UserEvent },
) => {
  const { userEvent, findByRole } = renderResult;
  await waitMenuOpen(renderResult);

  const menuItem = await findByRole('menuitem', { name: menuItemLabel });

  await userEvent.click(menuItem);
  await waitMenuClosed(renderResult);
};

export const activateTab = async (
  tabLabel: string,
  renderResult: BaseRenderResult & { userEvent: UserEvent },
) => {
  const { findByRole, userEvent } = renderResult;

  const tabItem = await findByRole('tab', { name: tabLabel });
  await userEvent.click(tabItem);
};

const clickSubMenuItemImpl = async (
  menuItemLabel: string,
  submenuLabel: string,
  renderResult: BaseRenderResult & { userEvent: UserEvent },
) => {
  const { findByRole, userEvent } = renderResult;
  await waitMenuOpen(renderResult, submenuLabel);

  const menuItem = await findByRole('menuitem', { name: menuItemLabel });
  await userEvent.click(menuItem);

  await waitMenuClosed(renderResult);
};

export const clickSubMenu = async (
  subMenuLabel: string,
  renderResult: BaseRenderResult & { userEvent: UserEvent },
  parentMenuLabel?: string,
) => {
  const { findByRole, userEvent } = renderResult;
  await waitMenuOpen(renderResult, parentMenuLabel);

  const subMenuItem = await findByRole('menuitem', { name: subMenuLabel });
  await userEvent.click(subMenuItem);

  const clickSubMenuItem = (subMenuItemLabel: string) =>
    clickSubMenuItemImpl(subMenuItemLabel, subMenuLabel, renderResult);
  const clickSubMenuNested = (nestedSubMenuLabel: string) =>
    clickSubMenu(nestedSubMenuLabel, renderResult, subMenuLabel);
  const returnToParent = async () => {
    const parentItem = await findByRole('menuitem', { name: parentMenuLabel });
    await userEvent.click(parentItem);
  };

  return {
    clickSubMenuItem,
    clickSubMenu: clickSubMenuNested,
    returnToParent,
  };
};

export const openIconMenu = async (
  menuLabel: string,
  renderResult: BaseRenderResult & { userEvent: UserEvent },
) => {
  const { userEvent, findByLabelText } = renderResult;

  const button = await findByLabelText(menuLabel);
  await userEvent.click(button);

  await waitMenuOpen(renderResult);
};

export const openMenu = async (
  triggerCaption: string,
  renderResult: BaseRenderResult & { userEvent: UserEvent },
) => {
  const { userEvent, findByRole } = renderResult;

  // Open menu
  const button = await findByRole('button', { name: triggerCaption });
  await userEvent.click(button);

  await waitMenuOpen(renderResult);
};

export const waitMenuClosed = async ({ queryByRole }: BaseRenderResult) => {
  await waitFor(() => expect(queryByRole('menu')).not.toBeInTheDocument());
};
