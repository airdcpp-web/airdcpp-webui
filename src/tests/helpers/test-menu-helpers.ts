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

export const openMenu = async (
  triggerCaption: string,
  renderResult: BaseRenderResult & { userEvent: UserEvent },
) => {
  const { userEvent, getByRole, findByRole } = renderResult;

  // getByRole('button', { name: caption });
  await waitFor(() => expect(getByRole('button', { name: triggerCaption })).toBeTruthy());

  await userEvent.click(getByRole('button', { name: triggerCaption }));

  await waitFor(() => expect(findByRole('menu')).toBeTruthy());
};

export const waitMenuClosed = async ({ queryByRole }: BaseRenderResult) => {
  await waitFor(() => expect(queryByRole('menu')).not.toBeInTheDocument());
};
