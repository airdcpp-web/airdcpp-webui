import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { renderDataRoutes } from '@/tests/render/test-renderers';

import { waitFor } from '@testing-library/dom';
import {
  createTestModalController,
  TestRouteModalNavigateButton,
} from '@/tests/helpers/test-dialog-helpers';
import MainLayoutNormal from '../MainLayoutNormal';
import IconConstants from '@/constants/IconConstants';
import RouteModal from '@/components/semantic/RouteModal';
import ModalRouteDecorator from '@/decorators/ModalRouteDecorator';
import {
  NavigateBackCaption,
  TestNavigateBackButton,
  TestRouteNavigateButton,
} from '@/tests/helpers/test-route-helpers';
import { RouteItem } from '@/routes/Routes';
import TransferConstants from '@/constants/TransferConstants';
import ShareConstants from '@/constants/ShareConstants';
import HashConstants from '@/constants/HashConstants';
import { TransferStatsResponse } from '@/tests/mocks/api/transfers';
import { HashStatsResponse } from '@/tests/mocks/api/hash';
import { ShareGetRefreshTasksResponse } from '@/tests/mocks/api/share';
import { clickButton, clickMenuItem } from '@/tests/helpers/test-helpers';

import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';

import '@/style.css';
import { setupUserEvent } from '@/tests/helpers/test-form-helpers';

const MainDialogOpenCaption = 'Open main test dialog';
const SidebarDialogOpenCaption = 'Open sidebar test dialog';

const MainDialogCaption = 'Main test dialog';

const SidebarRouteMenuCaption = 'Sidebar route menu item';
const SidebarRouteContentCaption = 'Sidebar route content';

const MainDialogSidebarOpenCaption = 'Main dialog sidebar open caption';

const TestRoutes = {
  main: '/main',
  mainModal: '/main/modal',

  sidebar: '/sidebar',
  sidebarModal: '/sidebar/modal',
};

const TestRouteModalContent = () => {
  return (
    <RouteModal
      id="modal"
      title={MainDialogCaption}
      onApprove={() => Promise.resolve()}
      closable={false}
      icon={IconConstants.FOLDER}
    >
      Main route test modal
      <TestRouteNavigateButton
        caption={MainDialogSidebarOpenCaption}
        route={TestRoutes.sidebar}
      />
    </RouteModal>
  );
};

const TestRouteModal = ModalRouteDecorator(TestRouteModalContent, 'modal');

// tslint:disable:no-empty
describe('MainLayout', () => {
  let server: MockServer;

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server);

    // Transfers
    const transferStats = server.addSubscriptionHandler(
      TransferConstants.MODULE_URL,
      TransferConstants.STATISTICS,
    );

    server.addRequestHandler(
      'GET',
      TransferConstants.STATISTICS_URL,
      TransferStatsResponse,
    );

    // Share
    server.addRequestHandler(
      'GET',
      ShareConstants.REFRESH_TASKS_URL,
      ShareGetRefreshTasksResponse,
    );

    const shareRefreshStarted = server.addSubscriptionHandler(
      ShareConstants.MODULE_URL,
      ShareConstants.REFRESH_STARTED,
    );

    const shareRefreshCompleted = server.addSubscriptionHandler(
      ShareConstants.MODULE_URL,
      ShareConstants.REFRESH_COMPLETED,
    );

    // Hash
    const hashStats = server.addSubscriptionHandler(
      HashConstants.MODULE_URL,
      HashConstants.STATISTICS,
    );

    server.addRequestHandler('GET', HashConstants.STATS_URL, HashStatsResponse);

    return {
      commonData,
      server,
      transferStats,
      shareRefreshStarted,
      shareRefreshCompleted,
      hashStats,
    };
  };

  const MainComponent = () => {
    return (
      <>
        <div>Main route</div>
        <TestRouteModalNavigateButton
          caption={MainDialogOpenCaption}
          modalRoute={TestRoutes.mainModal}
        />
        <TestRouteModal />
      </>
    );
  };

  const SidebarComponent = () => {
    return (
      <div>
        {SidebarRouteContentCaption}
        <TestRouteModalNavigateButton
          caption={SidebarDialogOpenCaption}
          modalRoute={TestRoutes.sidebarModal}
        />
        <TestRouteModal />
        <TestNavigateBackButton />
      </div>
    );
  };

  const PrimaryRoutes = [
    {
      title: 'Main route',
      path: `${TestRoutes.main}`,
      icon: IconConstants.HOME,
      component: MainComponent,
    },
  ];

  const SecondaryRoutes: RouteItem[] = [];

  const SidebarRoutes = [
    {
      title: SidebarRouteMenuCaption,
      path: TestRoutes.sidebar,
      icon: IconConstants.EXTERNAL,
      component: SidebarComponent,
    },
  ];

  const renderNormalLayout = async () => {
    const { commonData } = await getSocket();
    const MainLayoutNormalTest = () => {
      return (
        <MainLayoutNormal
          primaryRoutes={PrimaryRoutes}
          secondaryRoutes={SecondaryRoutes}
          sidebarRoutes={SidebarRoutes}
          urgencies={{}}
        />
      );
    };

    const routes = [
      {
        path: '*',
        Component: MainLayoutNormalTest,
      },
    ];

    const renderData = renderDataRoutes(routes, commonData, {
      routerProps: { initialEntries: [TestRoutes.main] },
    });

    const userEvent = setupUserEvent();
    const modalController = createTestModalController(renderData);
    return { modalController, ...renderData, userEvent };
  };

  describe('normal layout', () => {
    test('should close modals when opening sidebar', async () => {
      const { getByText, modalController, queryByText, getByRole } =
        await renderNormalLayout();

      // Open dialog in the main layout
      await modalController.openDialog(MainDialogOpenCaption);
      await waitFor(() => modalController.expectDialogOpen());

      // Open sidebar
      clickButton(MainDialogSidebarOpenCaption, getByRole);
      await waitFor(() => expect(getByText(SidebarRouteContentCaption)).toBeTruthy());

      // Dialog should now be closed
      await waitFor(() => modalController.expectDialogClosed());

      // Navigate back to the modal
      clickButton(NavigateBackCaption, getByRole);
      await waitFor(() => modalController.expectDialogOpen());

      // Sidebar should be closed
      await waitFor(() =>
        expect(queryByText(SidebarRouteContentCaption)).not.toBeInTheDocument(),
      );
    });

    test('should open modals in sidebar', async () => {
      const renderData = await renderNormalLayout();
      const { getByText, modalController, getByRole } = renderData;

      // Open sidebar
      clickMenuItem(SidebarRouteMenuCaption, renderData);
      await waitFor(() => expect(getByText(SidebarRouteContentCaption)).toBeTruthy());

      // Open sidebar dialog
      await modalController.openDialog(SidebarDialogOpenCaption);
      await waitFor(() => modalController.expectDialogOpen());

      // Navigate back to the modal
      clickButton(NavigateBackCaption, getByRole);
      await waitFor(() => modalController.expectDialogClosed());

      // Sidebar should still be open
      await waitFor(() => expect(getByText(SidebarRouteContentCaption)).toBeTruthy());
    });
  });
});
