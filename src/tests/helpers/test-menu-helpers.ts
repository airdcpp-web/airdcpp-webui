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
  const { getByRole, userEvent } = renderResult;
  await waitMenuOpen(renderResult);

  await waitFor(() =>
    expect(getByRole('menuitem', { name: menuItemLabel })).toBeTruthy(),
  );

  await userEvent.click(getByRole('menuitem', { name: menuItemLabel }));
  await waitMenuClosed(renderResult);
};

export const activateTab = async (
  tabLabel: string,
  renderResult: BaseRenderResult & { userEvent: UserEvent },
) => {
  const { getByRole, userEvent } = renderResult;

  await waitFor(() => expect(getByRole('tab', { name: tabLabel })).toBeTruthy());

  await userEvent.click(getByRole('tab', { name: tabLabel }));
};

const clickSubMenuItemImpl = async (
  menuItemLabel: string,
  submenuLabel: string,
  renderResult: BaseRenderResult & { userEvent: UserEvent },
) => {
  const { getByRole, userEvent } = renderResult;
  await waitMenuOpen(renderResult, submenuLabel);

  await waitFor(() =>
    expect(getByRole('menuitem', { name: menuItemLabel })).toBeTruthy(),
  );

  await userEvent.click(getByRole('menuitem', { name: menuItemLabel }));
  await waitMenuClosed(renderResult);
};

export const clickSubMenu = async (
  subMenuLabel: string,
  renderResult: BaseRenderResult & { userEvent: UserEvent },
  parentMenuLabel?: string,
) => {
  const { getByRole, userEvent } = renderResult;
  await waitMenuOpen(renderResult, parentMenuLabel);

  await waitFor(() => expect(getByRole('menuitem', { name: subMenuLabel })).toBeTruthy());

  await userEvent.click(getByRole('menuitem', { name: subMenuLabel }));

  const clickSubMenuItem = (subMenuItemLabel: string) =>
    clickSubMenuItemImpl(subMenuItemLabel, subMenuLabel, renderResult);
  const clickSubMenuNested = (nestedSubMenuLabel: string) =>
    clickSubMenu(nestedSubMenuLabel, renderResult, subMenuLabel);
  const returnToParent = async () => {
    await waitFor(() => getByRole('button', { name: parentMenuLabel }));
    await userEvent.click(getByRole('button', { name: parentMenuLabel }));
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
  const { userEvent, getByLabelText } = renderResult;

  await waitFor(() => expect(getByLabelText(menuLabel)).toBeTruthy());

  const button = getByLabelText(menuLabel);
  await userEvent.click(button);

  await waitMenuOpen(renderResult);
};

export const openMenu = async (
  triggerCaption: string,
  renderResult: BaseRenderResult & { userEvent: UserEvent },
) => {
  const { userEvent, getByRole } = renderResult;

  // Open
  await waitFor(() => expect(getByRole('button', { name: triggerCaption })).toBeTruthy());

  const button = getByRole('button', { name: triggerCaption });
  await userEvent.click(button);

  await waitMenuOpen(renderResult);
};

export const waitMenuClosed = async ({ queryByRole }: BaseRenderResult) => {
  await waitFor(() => expect(queryByRole('menu')).not.toBeInTheDocument());
};
