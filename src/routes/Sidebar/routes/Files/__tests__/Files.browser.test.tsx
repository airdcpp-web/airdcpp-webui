import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { fireEvent, RenderResult, waitFor } from '@testing-library/react';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import Files from '../components/Files';

import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';

import * as API from '@/types/api';

import SocketNotificationListener from '@/components/main/notifications/SocketNotificationListener';
import ViewFileConstants from '@/constants/ViewFileConstants';
import {
  ViewedFileLongContent,
  ViewedFileNfoContent,
} from '@/tests/mocks/http/viewed-file-content';
import {
  ViewedFileNfoResponse,
  ViewedFileTextLongResponse,
} from '@/tests/mocks/api/viewed-files';

import createFetchMock from 'vitest-fetch-mock';
import { setupUserEvent } from '@/tests/helpers/test-form-helpers';
import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';
import { sleep } from '@/utils/Promise';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import { createDataFetchRoutes } from '@/tests/helpers/test-route-helpers';
import { selectTopLayoutSession } from '@/tests/helpers/test-session-helpers';
import { installBasicSessionHandlers } from '@/tests/mocks/mock-session';

const fetchMocker = createFetchMock(vi);

// tslint:disable:no-empty
describe('Viewed files', () => {
  let server: MockServer;

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server, {
      permissions: [API.AccessEnum.VIEW_FILE_VIEW, API.AccessEnum.VIEW_FILE_EDIT],
    });

    // Read
    const { onSessionRead: onSession1Read } = installBasicSessionHandlers(
      ViewFileConstants.SESSIONS_URL,
      ViewedFileTextLongResponse.id,
      server,
    );
    const { onSessionRead: onSession2Read } = installBasicSessionHandlers(
      ViewFileConstants.SESSIONS_URL,
      ViewedFileNfoResponse.id,
      server,
    );

    const viewFileDownloaded = server.addSubscriptionHandler(
      ViewFileConstants.MODULE_URL,
      ViewFileConstants.FILE_DOWNLOADED,
    );

    return {
      commonData,
      onSession1Read,
      onSession2Read,
      viewFileDownloaded,
    };
  };

  const renderLayout = async () => {
    const { commonData, ...other } = await getSocket();
    const { sessionStore } = commonData;
    sessionStore.getState().activity.setUserActive(true);

    const FileLayoutTest = () => {
      return (
        <>
          <Files />
          <SocketNotificationListener />
        </>
      );
    };

    const routes = createDataFetchRoutes([
      {
        path: '/files/:session?/:id?/*',
        Component: FileLayoutTest,
      },
    ]);

    const renderData = renderDataRoutes(routes, commonData, {
      viewType: VIEW_FIXED_HEIGHT,
      routerProps: { initialEntries: ['/files'] },
    });

    const userEvent = setupUserEvent();
    return { ...commonData, ...renderData, ...other, userEvent };
  };

  beforeEach(() => {
    server = getMockServer();

    // fetchMocker.doMock();
    fetchMocker.enableMocks();

    fetchMocker.mockIf(/.*$/, (req) => {
      if (req.url.includes(ViewedFileTextLongResponse.tth)) {
        return ViewedFileLongContent;
      } else if (req.url.includes(ViewedFileNfoResponse.tth)) {
        return ViewedFileNfoContent;
      } else {
        return {
          status: 404,
          body: 'Not Found',
        };
      }
    });
  });

  afterEach(() => {
    server.stop();
  });

  const waitText = async (text: string, getByText: RenderResult['getByText']) => {
    await waitFor(() => expect(getByText(text, { exact: false })).toBeTruthy());
  };

  test('should load file content', async () => {
    const renderResult = await renderLayout();
    const { getByText, onSession1Read } = renderResult;

    // Check content
    await waitText('This is long text file', getByText);

    // Open a different session
    await selectTopLayoutSession(
      ViewedFileNfoResponse.name,
      renderResult,
      onSession1Read,
    );

    // Check content
    await waitText('This is NFO', getByText);
  });

  test('should remember scroll position', async () => {
    const renderResult = await renderLayout();
    const { getByText, getByRole, sessionStore, onSession1Read, onSession2Read } =
      renderResult;

    await waitText('This is long text file', getByText);

    await sleep(10); // Make sure that the scroll listeners are added before scrolling

    // Scroll
    const scrollContainer = getByRole('article');
    fireEvent.scroll(scrollContainer, { target: { scrollTop: 200 } });

    await waitFor(() => expect(scrollContainer.scrollTop).toBe(200));
    await waitFor(() =>
      expect(
        sessionStore
          .getState()
          .viewFiles.scroll.getScrollData(ViewedFileTextLongResponse.id),
      ).toBe(200),
    );

    // Switch to another session
    await selectTopLayoutSession(
      ViewedFileNfoResponse.name,
      renderResult,
      onSession1Read,
    );
    await waitText('This is NFO', getByText);
    expect(scrollContainer.scrollTop).toBe(0);

    // Switch back to the original one, the scroll position should remain
    await selectTopLayoutSession(
      ViewedFileTextLongResponse.name,
      renderResult,
      onSession2Read,
    );
    await waitText('This is long text file', getByText);
    await waitFor(() => expect(scrollContainer.scrollTop).toBe(200));
  });
});
