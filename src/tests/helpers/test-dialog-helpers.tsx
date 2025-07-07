import { act, fireEvent, waitFor } from '@testing-library/react';
import Button from '@/components/semantic/Button';
import { clickButton, waitForUrl } from './test-helpers';
import { useState } from 'react';
import { expect } from 'vitest';
import { TestRouteNavigateButton } from './test-route-helpers';
import { BaseRenderResult, DataRouteRenderResult } from '../render/test-renderers';

const TestRouteModalButtonCaption = 'Open modal';

export const TestRouteModalNavigateButton = ({ modalRoute }: { modalRoute: string }) => {
  return (
    <TestRouteNavigateButton caption={TestRouteModalButtonCaption} route={modalRoute} />
  );
};

export const useModalButton = () => {
  const [open, setOpen] = useState(false);
  const button = (
    <Button
      caption="Open modal"
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

  const openDialog = async () => {
    await act(async () => {
      clickButton('Open modal', getByRole);
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

export const createTestModalController = ({
  getByRole,
  getByText,
  container,
}: BaseRenderResult) => {
  const openDialog = async () => {
    await act(async () => {
      clickButton(TestRouteModalButtonCaption, getByRole);
    });

    await waitFor(() =>
      expect(container.querySelector('.ui.modal.active.visible')).toBeTruthy(),
    );
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

  return { closeDialogButton, closeDialogText, openDialog };
};
