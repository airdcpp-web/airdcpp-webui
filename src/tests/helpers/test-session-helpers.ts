import { UserEvent } from '@testing-library/user-event';
import { BaseRenderResult } from '../render/test-renderers';
import { clickMenuItem, openIconMenu } from './test-menu-helpers';
import { waitFor } from '@testing-library/dom';
import { expect, Mock } from 'vitest';

export const selectTopLayoutSession = async (
  sessionLabel: string,
  renderResult: BaseRenderResult & { userEvent: UserEvent },
  onRead?: Mock,
) => {
  await openIconMenu('Session menu', renderResult);
  await clickMenuItem(sessionLabel, renderResult);

  if (onRead) {
    await waitFor(() => expect(onRead).toHaveBeenCalled());
  }
};
