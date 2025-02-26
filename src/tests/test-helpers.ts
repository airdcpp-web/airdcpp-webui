import {
  fireEvent,
  Matcher,
  RenderResult,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { RouteRenderResult } from './test-containers';
import { expect } from 'vitest';

export const DataLoaderText = /Loading data.*/;

export const waitForUrl = async (
  pathName: string,
  router: RouteRenderResult['router'],
) => {
  await waitFor(() => {
    expect(router.state.location.pathname).toEqual(pathName);
  });
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
