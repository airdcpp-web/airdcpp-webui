import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  fireEvent,
  RenderResult,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import { getMockServer } from 'airdcpp-apisocket/tests';

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

const fetchMocker = createFetchMock(vi);

// tslint:disable:no-empty
describe('Viewed files', () => {
  let server: ReturnType<typeof getMockServer>;

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server, [
      API.AccessEnum.VIEW_FILE_VIEW,
      API.AccessEnum.VIEW_FILE_EDIT,
    ]);

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
    localStorage.clear();
  });

  const selectSession = async (
    sessionLabel: string,
    {
      getByLabelText,
      getByText,
      getByRole,
    }: Pick<RenderResult, 'getByLabelText' | 'getByText' | 'getByRole'>,
  ) => {
    const userEvent = setupUserEvent();
    const menuTrigger = getByLabelText('Session menu');
    expect(menuTrigger).toBeTruthy();
    await userEvent.click(menuTrigger!);

    const sessionMenuItem = getByText(sessionLabel);
    expect(sessionMenuItem).toBeTruthy();
    await userEvent.click(sessionMenuItem!);

    await waitForElementToBeRemoved(() => getByRole('menu'));
  };

  const waitText = async (text: string, getByText: RenderResult['getByText']) => {
    await waitFor(() => expect(getByText(text, { exact: false })).toBeTruthy());
  };

  test('should load file content', async () => {
    const { getByText, getByLabelText, getByRole, socket } = await renderLayout();

    // Check content
    await waitText('This is long text file', getByText);

    // Open a different session
    await selectSession(ViewedFileNfoResponse.name, {
      getByLabelText,
      getByText,
      getByRole,
    });

    // Check content
    await waitText('This is NFO', getByText);

    socket.disconnect();
  });

  test('should remember scroll position', async () => {
    const { getByText, getByLabelText, getByRole, socket, sessionStore } =
      await renderLayout();

    await waitText('This is long text file', getByText);

    const scrollContainer = getByRole('article');

    //scrollContainer.scrollTo({
    //  top: 200,
    //});
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
    await selectSession(ViewedFileNfoResponse.name, {
      getByLabelText,
      getByText,
      getByRole,
    });
    await waitText('This is NFO', getByText);
    expect(scrollContainer.scrollTop).toBe(0);

    // Switch back to the original one, the scroll position should remain
    await selectSession(ViewedFileTextLongResponse.name, {
      getByLabelText,
      getByText,
      getByRole,
    });
    await waitText('This is long text file', getByText);
    await waitFor(() => expect(scrollContainer.scrollTop).toBe(200));

    socket.disconnect();
  });
});
