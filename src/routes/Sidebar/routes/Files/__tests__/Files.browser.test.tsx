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

import { renderDataRoutes } from '@/tests/render/test-renderers';

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

    return { ...commonData, ...renderData, ...other };
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
    {
      getByLabelText,
      getByText,
      getByRole,
    }: Pick<RenderResult, 'getByLabelText' | 'getByText' | 'getByRole'>,
    onRead: Mock,
  ) => {
    const userEvent = setupUserEvent();
    const menuTrigger = getByLabelText('Session menu');
    expect(menuTrigger).toBeTruthy();
    await userEvent.click(menuTrigger!);

    const sessionMenuItem = getByText(sessionLabel);
    expect(sessionMenuItem).toBeTruthy();
    await userEvent.click(sessionMenuItem!);

    await waitFor(() => expect(onRead).toHaveBeenCalled());
  };

  const waitText = async (text: string, getByText: RenderResult['getByText']) => {
    await waitFor(() => expect(getByText(text, { exact: false })).toBeTruthy());
  };

  test('should load file content', async () => {
    const { getByText, getByLabelText, getByRole, onSession1Read } = await renderLayout();

    // Check content
    await waitText('This is long text file', getByText);

    // Open a different session
    await selectSession(
      ViewedFileNfoResponse.name,
      {
        getByLabelText,
        getByText,
        getByRole,
      },
      onSession1Read,
    );

    // Check content
    await waitText('This is NFO', getByText);
  });

  test('should remember scroll position', async () => {
    const {
      getByText,
      getByLabelText,
      getByRole,
      sessionStore,
      onSession1Read,
      onSession2Read,
    } = await renderLayout();

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
    await selectSession(
      ViewedFileNfoResponse.name,
      {
        getByLabelText,
        getByText,
        getByRole,
      },
      onSession1Read,
    );
    await waitText('This is NFO', getByText);
    expect(scrollContainer.scrollTop).toBe(0);

    // Switch back to the original one, the scroll position should remain
    await selectSession(
      ViewedFileTextLongResponse.name,
      {
        getByLabelText,
        getByText,
        getByRole,
      },
      onSession2Read,
    );
    await waitText('This is long text file', getByText);
    await waitFor(() => expect(scrollContainer.scrollTop).toBe(200));
  });
});
