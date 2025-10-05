import { fireEvent, Matcher, RenderResult, waitFor } from '@testing-library/react';
import { expect, Mock } from 'vitest';
import { BasicRouteRenderResult } from '../render/test-renderers';
import { UserEvent } from '@testing-library/user-event';

export const waitForUrl = async (
  pathName: string,
  router: BasicRouteRenderResult['router'],
) => {
  await waitFor(() => {
    expect(router.state.location.pathname).toEqual(pathName);
  });
};

export const navigateToUrl = async (
  pathName: string,
  router: BasicRouteRenderResult['router'],
) => {
  router.navigate(pathName);
  await waitForUrl(pathName, router);
};

export const waitForData = async (
  text: Matcher,
  queryByText: RenderResult['queryByText'],
) => {
  await waitFor(() => expect(queryByText(text)).toBeInTheDocument());
  await waitFor(() => expect(queryByText(text)).not.toBeInTheDocument());
};

export const waitForLoader = async (queryByRole: RenderResult['queryByRole']) => {
  await waitFor(() => expect(queryByRole('progressbar')).toBeInTheDocument());
  await waitFor(() => expect(queryByRole('progressbar')).not.toBeInTheDocument());
};

export const clickButton = (caption: string, getByRole: RenderResult['getByRole']) => {
  const button = getByRole('button', { name: caption });
  return expect(fireEvent.click(button)).toBeTruthy();
};

export const clickIconButton = async (
  caption: string,
  { getByLabelText, userEvent }: RenderResult & { userEvent: UserEvent },
) => {
  const button = getByLabelText(caption);
  await userEvent.click(button);
};

export const parseMockRequest = (request: any) => {
  const { callback_id, ...other } = request;
  return other;
};

export const waitExpectRequestToMatchSnapshot = async (mock: Mock) => {
  await waitFor(() => expect(mock).toHaveBeenCalledTimes(1));

  const response = mock.mock.calls[0][0];

  expect(parseMockRequest(response)).toMatchSnapshot();
};
