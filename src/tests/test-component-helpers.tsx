import {
  act,
  fireEvent,
  Matcher,
  RenderResult,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { waitForExpect } from 'airdcpp-apisocket/tests/helpers.js';
import Button from 'components/semantic/Button';
import { useNavigate } from 'react-router';
import { RouteRenderResult } from './test-containers';

export const waitForUrl = async (
  pathName: string,
  router: RouteRenderResult['router'],
) => {
  await waitForExpect(() => expect(router.state.location.pathname).toEqual(pathName));
};

export const waitForData = async (
  text: Matcher,
  queryByText: RenderResult['queryByText'],
) => {
  await waitFor(() => queryByText(text));
  await waitForElementToBeRemoved(() => queryByText(text));
};

export const clickButton = (caption: string, getByRole: RenderResult['getByRole']) => {
  return expect(fireEvent.click(getByRole('button', { name: caption }))).toBeTruthy();
};

export const TestModalNavigateButton = ({ modalRoute }: { modalRoute: string }) => {
  const navigate = useNavigate();
  return (
    <Button
      caption="Open modal"
      onClick={() => {
        navigate(modalRoute);
      }}
    />
  );
};

export const DataLoaderText = /Loading data.*/;

export const createTestModalController = ({
  getByRole,
  getByText,
  container,
  router,
}: RouteRenderResult) => {
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
    await act(async () => {
      clickButton(buttonCaption, getByRole);
      await waitForUrl(initialUrl, router);
    });
  };

  const closeDialogText = async (text: string) => {
    await act(async () => {
      expect(fireEvent.click(getByText(text))).toBeTruthy();
      await waitForUrl(initialUrl, router);
    });
  };

  return { closeDialogButton, closeDialogText, openDialog };
};
