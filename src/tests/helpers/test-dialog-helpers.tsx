import { act, fireEvent, waitFor } from '@testing-library/react';
import Button from '@/components/semantic/Button';
import { clickButton, clickIconButton, waitForUrl } from './test-helpers';
import { useState } from 'react';
import { expect } from 'vitest';
import { TestRouteNavigateButton } from './test-route-helpers';
import { BaseRenderResult, DataRouteRenderResult } from '../render/test-renderers';
import { UserEvent } from '@testing-library/user-event';

const DefaultOpenModalButtonCaption = 'Open modal';

export const TestRouteModalNavigateButton = ({
  modalRoute,
  caption = DefaultOpenModalButtonCaption,
}: {
  modalRoute: string;
  caption?: string;
}) => {
  return <TestRouteNavigateButton caption={caption} route={modalRoute} />;
};

export const useModalButton = (caption = DefaultOpenModalButtonCaption) => {
  const [open, setOpen] = useState(false);
  const button = (
    <Button
      caption={caption}
      onClick={() => {
        setOpen(true);
      }}
    />
  );

  return {
    button,
    open,
    onClose: () => setOpen(false),
  };
};

export const createTestRouteModalController = ({
  getByRole,
  getByText,
  container,
  router,
}: DataRouteRenderResult) => {
  const initialUrl = router.state.location.pathname;

  const openDialog = async (caption = DefaultOpenModalButtonCaption) => {
    await act(async () => {
      clickButton(caption, getByRole);
    });

    await waitFor(() =>
      expect(container.querySelector('.ui.modal.active.visible')).toBeTruthy(),
    );
  };

  const closeDialogButton = async (buttonCaption: string) => {
    clickButton(buttonCaption, getByRole);
    await waitForUrl(initialUrl, router);
  };

  const closeDialogText = async (text: string) => {
    expect(fireEvent.click(getByText(text))).toBeTruthy();
    await waitForUrl(initialUrl, router);
  };

  return { closeDialogButton, closeDialogText, openDialog };
};

export const waitDialogClosed = async ({ queryByRole }: BaseRenderResult) => {
  await waitFor(() => {
    expect(queryByRole('dialog')).toBeFalsy();
  });
};

export const createTestModalController = (
  renderResult: BaseRenderResult & { userEvent: UserEvent },
) => {
  const { getByRole, getByText, container } = renderResult;

  const expectDialogOpen = () => {
    //const dialog = queryByRole('dialog');
    //expect(dialog).not.toBeInTheDocument();

    expect(container.querySelector('.ui.modal.active.visible')).toBeTruthy();
  };

  const expectDialogClosed = () => {
    //const dialog = queryByRole('dialog');
    //expect(dialog).not.toBeInTheDocument();
    expect(container.querySelector('.ui.modal.active.visible')).toBeFalsy();
  };

  interface DialogOpenProps {
    iconButton: boolean;
  }

  const openDialog = async (
    caption = DefaultOpenModalButtonCaption,
    { iconButton = false }: Partial<DialogOpenProps> = {},
  ) => {
    // await act(async () => {
    if (iconButton) {
      await clickIconButton(caption, renderResult);
    } else {
      clickButton(caption, getByRole);
    }
    //});

    await waitFor(() => expectDialogOpen());
  };

  const closeDialogButton = async (buttonCaption: string) => {
    clickButton(buttonCaption, getByRole);
    await waitFor(() =>
      expect(container.querySelector('.ui.modal.active.visible')).toBeFalsy(),
    );
  };

  const closeDialogText = async (text: string) => {
    expect(fireEvent.click(getByText(text))).toBeTruthy();
    await waitFor(() =>
      expect(container.querySelector('.ui.modal.active.visible')).toBeFalsy(),
    );
  };

  return {
    closeDialogButton,
    closeDialogText,
    openDialog,
    expectDialogOpen,
    expectDialogClosed,
  };
};
