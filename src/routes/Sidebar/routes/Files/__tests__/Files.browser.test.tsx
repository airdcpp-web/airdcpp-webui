import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  Mock,
  test,
  vi,
} from 'vitest';
import { fireEvent, RenderResult, waitFor } from '@testing-library/react';

import { BaseRenderResult, renderDataRoutes } from '@/tests/render/test-renderers';

import Files from '../components/Files';

import { useStoreDataFetch } from '@/components/main/effects/StoreDataFetchEffect';
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
import { UserEvent } from '@testing-library/user-event';
import { clickMenuItem, openIconMenu } from '@/tests/helpers/test-menu-helpers';

const fetchMocker = createFetchMock(vi);

// tslint:disable:no-empty
describe('Viewed files', () => {
  let server: MockServer;

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server, {
      permissions: [API.AccessEnum.VIEW_FILE_VIEW, API.AccessEnum.VIEW_FILE_EDIT],
    });

    // Messages
    const onSession1Read = vi.fn();
    server.addRequestHandler(
      'POST',
      `${ViewFileConstants.SESSIONS_URL}/${ViewedFileTextLongResponse.id}/read`,
      undefined,
      onSession1Read,
    );

    const onSession2Read = vi.fn();
    server.addRequestHandler(
      'POST',
      `${ViewFileConstants.SESSIONS_URL}/${ViewedFileNfoResponse.id}/read`,
      undefined,
      onSession2Read,
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
      useStoreDataFetch(true);
      return (
        <>
          <Files />
          <SocketNotificationListener />
        </>
      );
    };

    const routes = [
      {
        path: '/files/:session?/:id?/*',
        Component: FileLayoutTest,
      },
    ];

    const renderData = renderDataRoutes(routes, commonData, {
      viewType: VIEW_FIXED_HEIGHT,
      routerProps: { initialEntries: ['/files'] },
    });

    const userEvent = setupUserEvent();
    return { ...commonData, ...renderData, ...other, userEvent };
  };

  beforeAll(() => {
    localStorage.setItem('debug', 'true');
  });

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

  const selectSession = async (
    sessionLabel: string,
    renderResult: BaseRenderResult & { userEvent: UserEvent },
    onRead: Mock,
  ) => {
    await openIconMenu('Session menu', renderResult);
    await clickMenuItem(sessionLabel, renderResult);

    await waitFor(() => expect(onRead).toHaveBeenCalled());
  };

  const waitText = async (text: string, getByText: RenderResult['getByText']) => {
    await waitFor(() => expect(getByText(text, { exact: false })).toBeTruthy());
  };

  test('should load file content', async () => {
    const renderResult = await renderLayout();
    const { getByText, onSession1Read } = renderResult;

    // Check content
    await waitText('This is long text file', getByText);

    // Open a different session
    await selectSession(ViewedFileNfoResponse.name, renderResult, onSession1Read);

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
    await selectSession(ViewedFileNfoResponse.name, renderResult, onSession1Read);
    await waitText('This is NFO', getByText);
    expect(scrollContainer.scrollTop).toBe(0);

    // Switch back to the original one, the scroll position should remain
    await selectSession(ViewedFileTextLongResponse.name, renderResult, onSession2Read);
    await waitText('This is long text file', getByText);
    await waitFor(() => expect(scrollContainer.scrollTop).toBe(200));
  });
});
