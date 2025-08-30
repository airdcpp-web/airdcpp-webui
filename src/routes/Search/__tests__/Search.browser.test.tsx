import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { renderDataRoutes } from '@/tests/render/test-renderers';

import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';

import { getMockServer, MockServer } from '@/tests/mocks/mock-server';
import { installTableMocks } from '@/tests/mocks/mock-table';

import { waitFor } from '@testing-library/dom';
import {
  clickButton,
  clickIconButton,
  navigateToUrl,
  waitExpectRequestToMatchSnapshot,
  waitForLoader,
  waitForUrl,
} from '@/tests/helpers/test-helpers';

import Search from '../components/Search';
import SearchConstants from '@/constants/SearchConstants';
import {
  GroupedSearchResultChildrenResponse,
  GroupedSearchResultDirectoryResponse,
  GroupedSearchResultFileResponse,
  GroupedSearchResultsListResponse,
  SearchInstanceHubSearchPostResponse,
  SearchInstanceListResponse,
  SearchInstanceNewResponse,
  SearchTypesListResponse,
} from '@/tests/mocks/api/search';
import HistoryConstants, { HistoryStringEnum } from '@/constants/HistoryConstants';
import {
  setInputFieldValuesByName,
  setInputFieldValuesByPlaceholder,
  setupUserEvent,
  toggleCheckboxValue,
} from '@/tests/helpers/test-form-helpers';
import { HubADC1, HubADC2, HubADC3, HubNMDC1 } from '@/tests/mocks/api/hubs';
import { VIEW_FIXED_HEIGHT } from '@/tests/render/test-containers';
import { clickMenuItem, openMenu } from '@/tests/helpers/test-menu-helpers';
import { installActionMenuMocks } from '@/components/action-menu/__tests__/test-action-menu-helpers';
import MenuConstants from '@/constants/MenuConstants';

describe('Search layout', () => {
  let server: MockServer;

  beforeEach(() => {
    server =
      getMockServer(/*{
      loggerOptions: {
        logLevel: 'verbose',
      },
    }*/);
  });

  afterEach(() => {
    server.stop();
  });

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(
      server /*, {
      socketOptions: {
        logLevel: 'verbose',
      },
    }*/,
    );

    // Tables
    const resultTableMocks = installTableMocks([], {
      // The view should be initially empty
      server,
      moduleUrl: SearchConstants.MODULE_URL,
      viewName: SearchConstants.VIEW_ID,
      entityId: SearchInstanceNewResponse.id,
    });

    // Search instances
    server.addRequestHandler(
      'GET',
      SearchConstants.INSTANCES_URL,
      SearchInstanceListResponse,
    );

    const onCreateInstance = vi.fn();
    server.addRequestHandler(
      'POST',
      SearchConstants.INSTANCES_URL,
      SearchInstanceNewResponse,
      onCreateInstance,
    );

    server.addRequestHandler(
      'GET',
      `${SearchConstants.INSTANCES_URL}/${SearchInstanceNewResponse.id}`,
      SearchInstanceNewResponse,
    );

    // Instance
    const onPostHubSearch = vi.fn();
    server.addRequestHandler(
      'POST',
      `${SearchConstants.INSTANCES_URL}/${SearchInstanceNewResponse.id}/hub_search`,
      SearchInstanceHubSearchPostResponse,
      onPostHubSearch,
    );

    // Results
    installActionMenuMocks(MenuConstants.GROUPED_SEARCH_RESULT, [], server);

    server.addRequestHandler(
      'GET',
      // eslint-disable-next-line max-len
      `${SearchConstants.INSTANCES_URL}/${SearchInstanceNewResponse.id}/results/${GroupedSearchResultDirectoryResponse.id}/children`,
      GroupedSearchResultChildrenResponse,
    );

    server.addRequestHandler(
      'GET',
      // eslint-disable-next-line max-len
      `${SearchConstants.INSTANCES_URL}/${SearchInstanceNewResponse.id}/results/${GroupedSearchResultDirectoryResponse.id}`,
      GroupedSearchResultDirectoryResponse,
    );

    // Histories
    const onAddHistory = vi.fn();
    server.addRequestHandler(
      'POST',
      `${HistoryConstants.STRINGS_URL}/${HistoryStringEnum.SEARCH}`,
      undefined,
      onAddHistory,
    );

    server.addRequestHandler(
      'GET',
      `${HistoryConstants.STRINGS_URL}/${HistoryStringEnum.SEARCH}`,
      ['search string old', 'C5HMPSV2L7EW4GZBTG6H4MUPKGQLAZUAGZNACHY'],
    );

    // Options
    server.addRequestHandler(
      'GET',
      SearchConstants.SEARCH_TYPES_URL,
      SearchTypesListResponse,
    );

    return {
      commonData,
      server,
      resultTableMocks,
      onCreateInstance,
      onAddHistory,
      onPostHubSearch,
    };
  };

  const renderLayout = async () => {
    const { commonData, server, ...other } = await getSocket();

    const SearchLayoutTest = () => {
      return <Search />;
    };

    const routes = [
      {
        index: true,
        Component: () => <div>Index page</div>,
      },
      {
        path: '/search/*',
        Component: SearchLayoutTest,
      },
    ];

    const renderData = renderDataRoutes(routes, commonData, {
      routerProps: { initialEntries: ['/search'] },
      viewType: VIEW_FIXED_HEIGHT,
    });

    const userEvent = setupUserEvent();
    return { ...renderData, ...other, ...commonData, userEvent };
  };

  test('should render', async () => {
    const renderData = await renderLayout();
    const {
      getByRole,
      queryByText,
      getByPlaceholderText,
      getByText,

      sessionStore,
      router,
      resultTableMocks,

      onCreateInstance,
      onPostHubSearch,
      onAddHistory,
    } = renderData;

    await waitFor(() => expect(onCreateInstance).toHaveBeenCalled());

    // Search shouldn't be available if we aren't connected to any hub
    await waitFor(() => expect(queryByText('No online hubs')).toBeTruthy());

    // Create a session, the search input should appear
    sessionStore.getState().hubs.init([HubADC1]);

    await waitFor(() =>
      expect(getByPlaceholderText('Enter search string...')).toBeTruthy(),
    );

    // Perform our search
    await setInputFieldValuesByPlaceholder(renderData, {
      'Enter search string...': 'ubuntu',
    });

    clickButton('Search', getByRole);

    await waitExpectRequestToMatchSnapshot(onPostHubSearch);
    await waitFor(() => expect(onAddHistory).toHaveBeenCalled());

    // Wait for the search results to be displayed
    const button = getByRole('button', { name: 'Search' });
    await waitFor(() => expect(button).toBeDisabled());

    // Send the results
    resultTableMocks.mockTableManager.setItems(GroupedSearchResultsListResponse);

    // The table should appear
    await waitFor(() => expect(getByRole('grid')).toBeTruthy());

    const groupedResult = GroupedSearchResultDirectoryResponse;
    await waitFor(() => expect(queryByText(groupedResult.name)).toBeTruthy());

    // Check dupe classes
    const nonDupeResult = getByText(GroupedSearchResultDirectoryResponse.name).closest(
      `.name`,
    );
    expect(nonDupeResult?.classList.contains('dupe')).toBeFalsy();

    const dupeResult = getByText(GroupedSearchResultFileResponse.name).closest(`.name`);
    expect(dupeResult?.classList.contains('dupe')).toBeTruthy();

    await navigateToUrl('/', router);
  });

  test('should open result details dialog', async () => {
    const renderData = await renderLayout();
    const {
      getByRole,
      queryByText,

      sessionStore,
      router,
      resultTableMocks,
    } = renderData;

    sessionStore.getState().hubs.init([HubADC1, HubADC2, HubADC3]);
    resultTableMocks.mockTableManager.setItems(GroupedSearchResultsListResponse);

    await waitFor(() => expect(getByRole('grid')).toBeTruthy());

    const result = GroupedSearchResultDirectoryResponse;
    await waitFor(() => expect(queryByText(result.name)).toBeTruthy());

    // Open the result dialog
    const contentCaption = result.name;
    await openMenu(contentCaption, renderData);
    await clickMenuItem('Result details', renderData);

    await waitFor(() => expect(getByRole('dialog')).toBeTruthy());

    // Close it
    clickButton('Close', getByRole);
    await waitForUrl('/search', router);

    await navigateToUrl('/', router);
  });

  test('should handle custom search options', async () => {
    const renderData = await renderLayout();
    const {
      getByRole,
      getByPlaceholderText,
      queryByRole,

      sessionStore,
      router,

      onPostHubSearch,
      userEvent,
    } = renderData;

    // Create a session, the search input should appear
    sessionStore.getState().hubs.init([HubADC1, HubADC2, HubADC3, HubNMDC1]);

    await waitFor(() =>
      expect(getByPlaceholderText('Enter search string...')).toBeTruthy(),
    );

    // Open search options
    await waitFor(() =>
      expect(getByRole('button', { name: 'Open search options' })).toBeTruthy(),
    );
    await clickIconButton('Open search options', renderData);

    await waitFor(() => expect(getByRole('form')).toBeTruthy());
    await waitForLoader(queryByRole);

    // Select type
    await openMenu('Any', renderData);
    await clickMenuItem('File', renderData);

    // Unselect a hub
    await userEvent.click(getByRole('button', { name: 'Hubs' }));
    await toggleCheckboxValue(HubADC3.identity.name, renderData);

    // Set size
    await userEvent.click(getByRole('button', { name: 'Size limits' }));
    await setInputFieldValuesByName(renderData, {
      'Minimum size': '1000',
      'Maximum size': '5000',
    });

    // Perform our search
    await setInputFieldValuesByPlaceholder(renderData, {
      'Enter search string...': 'ubuntu',
    });

    clickButton('Search', getByRole);

    await waitExpectRequestToMatchSnapshot(onPostHubSearch);

    await navigateToUrl('/', router);
  });
});
