import {
  act,
  fireEvent,
  RenderResult,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { waitForExpect } from 'airdcpp-apisocket/tests/helpers.js';
import Button from 'components/semantic/Button';
import { useNavigate } from 'react-router';

export const waitForUrl = async (pathName: string) => {
  await waitForExpect(() => expect(window.location.pathname).toEqual(pathName));
};

export const waitForData = async (
  text: string,
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

export const createTestModalController = ({
  getByRole,
  getByText,
  queryByText,
}: RenderResult) => {
  const initialUrl = window.location;

  const openDialog = async () => {
    await act(async () => {
      clickButton('Open modal', getByRole);
    });

    // Load data
    await waitForData('Loading data...', queryByText);
  };

  const closeDialogButton = async (buttonCaption: string) => {
    await act(async () => {
      clickButton(buttonCaption, getByRole);

      await waitForUrl(initialUrl.pathname);
    });
  };

  const closeDialogText = async (text: string) => {
    await act(async () => {
      expect(fireEvent.click(getByText(text))).toBeTruthy();
      await waitForUrl(initialUrl.pathname);
    });
  };

  return { closeDialogButton, closeDialogText, openDialog };
};
