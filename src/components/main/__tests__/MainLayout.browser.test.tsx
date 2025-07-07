import { afterEach, beforeEach, describe, expect, test /*, vi*/ } from 'vitest';
import { renderDataRoutes } from '@/tests/render/test-renderers';

import { fireEvent, waitFor } from '@testing-library/dom';
import {
  createTestModalController,
  TestRouteModalNavigateButton,
} from '@/tests/helpers/test-dialog-helpers';
import MainLayoutNormal from '../MainLayoutNormal';
import IconConstants from '@/constants/IconConstants';
import RouteModal from '@/components/semantic/RouteModal';
import ModalRouteDecorator from '@/decorators/ModalRouteDecorator';
import { TestRouteNavigateButton } from '@/tests/helpers/test-route-helpers';
import { RouteItem } from '@/routes/Routes';
import { getConnectedSocket, getMockServer } from 'airdcpp-apisocket/tests';
import TransferConstants from '@/constants/TransferConstants';
import ShareConstants from '@/constants/ShareConstants';
import HashConstants from '@/constants/HashConstants';
import { TransferStatsResponse } from '@/tests/mocks/api/transfers';
import { HashStatsResponse } from '@/tests/mocks/api/hash';
import { ShareGetRefreshTasksResponse } from '@/tests/mocks/api/share';

const DialogCaption = 'Test dialog';
const SidebarRouteMenuCaption = 'Sidebar route menu item';
const SidebarRouteContentCaption = 'Sidebar route content';

const SidebarDialogOpenCaption = 'Sidebar dialog open caption';

const TestRoutes = {
  main: '/main',
  mainModal: '/main/modal',

  sidebar: '/sidebar',
};

const TestRouteModalContent = () => {
  return (
    <RouteModal
      className="search-type"
      title={DialogCaption}
      onApprove={() => Promise.resolve()}
      closable={false}
      icon={IconConstants.FOLDER}
    >
      Test modal
      <TestRouteNavigateButton
        caption={SidebarDialogOpenCaption}
        route={TestRoutes.sidebar}
      />
    </RouteModal>
  );
};

const TestRouteModal = ModalRouteDecorator(TestRouteModalContent, 'modal');

// tslint:disable:no-empty
describe('MainLayout', () => {
  let server: ReturnType<typeof getMockServer>;
  const getSocket = async () => {
    const { socket } = await getConnectedSocket(server);

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
      socket,
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
        <TestRouteModalNavigateButton modalRoute={TestRoutes.mainModal} />
        <TestRouteModal />
      </>
    );
  };

  const SidebarComponent = () => {
    return <div>{SidebarRouteContentCaption}</div>;
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
    const { socket } = await getSocket();
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

    const renderData = renderDataRoutes(routes, {
      socket,
      routerProps: { initialEntries: [TestRoutes.main] },
    });

    const modalController = createTestModalController(renderData);
    return { modalController, ...renderData };
  };

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
    localStorage.clear();
  });

  describe('normal layout', () => {
    test('should render modal', async () => {
      const { getByText, modalController, queryByText } = await renderNormalLayout();

      await waitFor(() => expect(queryByText('Loading data...')).not.toBeInTheDocument());

      await modalController.openDialog();

      // Check content
      await waitFor(() => expect(getByText(DialogCaption)).toBeTruthy());

      // Open sidebar
      expect(fireEvent.click(getByText(SidebarDialogOpenCaption))).toBeTruthy();

      await waitFor(() => expect(getByText(SidebarRouteContentCaption)).toBeTruthy());

      // expect(getByText(DialogCaption)).toBeFalsy();
    }, 100000);
  });
});
