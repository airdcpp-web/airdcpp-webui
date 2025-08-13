import { UserEvent } from '@testing-library/user-event';
import { BaseRenderResult } from '../render/test-renderers';
import { waitFor } from '@testing-library/dom';
import { expect } from 'vitest';

/*export const clickItem = async (
  menuItemLabel: string,
  renderResult: BaseRenderResult & { user: UserEvent },
) => {
  const { getByRole } = renderResult;
  await waitFor(() =>
    expect(getByRole('menuitem', { name: menuItemLabel })).toBeTruthy(),
  );

  // Click
  await clickMenuItem(menuItemLabel, renderResult);
};*/

export const clickMenuItem = async (
  menuItemLabel: string,
  {
    getByRole,
    userEvent,
  }: Pick<BaseRenderResult, 'getByRole'> & { userEvent: UserEvent },
) => {
  await waitFor(() =>
    expect(getByRole('menuitem', { name: menuItemLabel })).toBeTruthy(),
  );

  await userEvent.click(getByRole('menuitem', { name: menuItemLabel }));
};

export const openIconMenu = async (
  menuLabel: string,
  renderResult: BaseRenderResult & { userEvent: UserEvent },
) => {
  const { userEvent, findByRole, getByLabelText } = renderResult;

  await waitFor(() => expect(getByLabelText(menuLabel)).toBeTruthy());
  await userEvent.click(getByLabelText(menuLabel));

  await waitFor(() => expect(findByRole('menu')).toBeTruthy());
};

export const openMenu = async (
  triggerCaption: string,
  renderResult: BaseRenderResult & { userEvent: UserEvent },
) => {
  const { userEvent, getByRole, queryByRole } = renderResult;

  // Open
  await waitFor(() => expect(getByRole('button', { name: triggerCaption })).toBeTruthy());
  await userEvent.click(getByRole('button', { name: triggerCaption }));

  // Wait for the menu to be fully visible
  await waitFor(() => {
    const menu = queryByRole('menu');
    expect(menu).toBeTruthy();
    expect(menu).not.toHaveClass('hidden'); // wait for the transition to complete
  });
};

export const waitMenuClosed = async ({ queryByRole }: BaseRenderResult) => {
  await waitFor(() => expect(queryByRole('menu')).not.toBeInTheDocument());
};
