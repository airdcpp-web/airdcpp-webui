import { fireEvent, Matcher, RenderResult, waitFor } from '@testing-library/react';
import { expect, Mock } from 'vitest';
import { BasicRouteRenderResult } from '../render/test-renderers';

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

export const clickIconButton = (
  caption: string,
  getByLabelText: RenderResult['getByLabelText'],
) => {
  const button = getByLabelText(caption);
  return expect(fireEvent.click(button)).toBeTruthy();
};

export const waitExpectRequestToMatchSnapshot = async (mock: Mock) => {
  await waitFor(() => expect(mock).toHaveBeenCalledTimes(1));

  const response = mock.mock.calls[0][0];

  const { callback_id, ...other } = response;

  expect(other).toMatchSnapshot();
};
