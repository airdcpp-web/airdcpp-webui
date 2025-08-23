import RouteModal from '@/components/semantic/RouteModal';
import HashConstants from '@/constants/HashConstants';
import IconConstants from '@/constants/IconConstants';
import ShareConstants from '@/constants/ShareConstants';
import TransferConstants from '@/constants/TransferConstants';
import ModalRouteDecorator from '@/decorators/ModalRouteDecorator';
import { setupUserEvent } from '@/tests/helpers/test-form-helpers';
import {
  TestNavigateBackButton,
  TestRouteNavigateButton,
} from '@/tests/helpers/test-route-helpers';
import { HashStatsRunning } from '@/tests/mocks/api/hash';
import { ShareGetRefreshTasksResponse } from '@/tests/mocks/api/share';
import { TransferStatsResponse } from '@/tests/mocks/api/transfers';
import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import { MockServer } from '@/tests/mocks/mock-server';
import { renderDataRoutes } from '@/tests/render/test-renderers';
import { MainLayoutProps } from '../AuthenticatedApp';
import {
  createTestModalController,
  TestRouteModalNavigateButton,
} from '@/tests/helpers/test-dialog-helpers';
import { RouteItem } from '@/routes/Routes';
import { ViewType } from '@/tests/render/test-containers';

const captions = {
  mainDialogOpen: 'Open main test dialog',
  sidebarDialogOpen: 'Open sidebar test dialog',
  mainDialog: 'Main test dialog',
  sidebarRouteMenu: 'Sidebar route menu item',
  sidebarRouteContent: 'Sidebar route content',
  mainDialogSidebarOpen: 'Main dialog sidebar open caption',
  secondaryRouteMenuCaption: 'Secondary route menu',
  secondaryRouteContent: 'Secondary route content',
};

export const MainLayoutCaptions = captions;

const routes = {
  main: '/main',
  mainModal: '/main/modal',

  secondary: '/secondary',

  sidebar: '/sidebar',
  sidebarModal: '/sidebar/modal',
};

export const MainLayoutRoutes = routes;

const TestRouteModalContent = () => {
  return (
    <RouteModal
      id="modal"
      title={captions.mainDialog}
      onApprove={() => Promise.resolve()}
      closable={false}
      icon={IconConstants.FOLDER}
    >
      Main route test modal
      <TestRouteNavigateButton
        caption={captions.mainDialogSidebarOpen}
        route={routes.sidebar}
      />
    </RouteModal>
  );
};

const TestRouteModal = ModalRouteDecorator(TestRouteModalContent, 'modal');

export const installMainLayoutMocks = (server: MockServer) => {
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

  server.addRequestHandler('GET', HashConstants.STATS_URL, HashStatsRunning);

  return {
    transferStats,
    shareRefreshStarted,
    shareRefreshCompleted,
    hashStats,
  };
};

export const createMainLayout = (
  Component: React.ComponentType<MainLayoutProps>,
  viewType: ViewType,
) => {
  const getSocket = async (server: MockServer) => {
    const commonData = await initCommonDataMocks(server);

    const mainMocks = installMainLayoutMocks(server);
    return {
      commonData,
      ...mainMocks,
    };
  };

  const MainComponent = () => {
    return (
      <>
        <div>Main route</div>
        <TestRouteModalNavigateButton
          caption={captions.mainDialogOpen}
          modalRoute={routes.mainModal}
        />
        <TestRouteModal />
      </>
    );
  };

  const SecondaryComponent = () => {
    return (
      <>
        <div>{captions.secondaryRouteContent}</div>
      </>
    );
  };

  const SidebarComponent = () => {
    return (
      <div>
        {captions.sidebarRouteContent}
        <TestRouteModalNavigateButton
          caption={captions.sidebarDialogOpen}
          modalRoute={routes.sidebarModal}
        />
        <TestRouteModal />
        <TestNavigateBackButton />
      </div>
    );
  };

  const PrimaryRoutes = [
    {
      title: 'Main route',
      path: `${routes.main}`,
      icon: IconConstants.HOME,
      component: MainComponent,
    },
  ];

  const SecondaryRoutes: RouteItem[] = [
    {
      title: captions.secondaryRouteMenuCaption,
      path: `${routes.secondary}`,
      icon: IconConstants.FAVORITE,
      component: SecondaryComponent,
    },
  ];

  const SidebarRoutes = [
    {
      title: captions.sidebarRouteMenu,
      path: routes.sidebar,
      icon: IconConstants.EXTERNAL,
      component: SidebarComponent,
    },
  ];

  const renderNormalLayout = async (server: MockServer) => {
    const { commonData } = await getSocket(server);
    const MainLayoutNormalTest = () => {
      return (
        <Component
          primaryRoutes={PrimaryRoutes}
          secondaryRoutes={SecondaryRoutes}
          sidebarRoutes={SidebarRoutes}
          urgencies={{}}
        />
      );
    };

    const rootRoutes = [
      {
        path: '*',
        Component: MainLayoutNormalTest,
      },
    ];

    const renderData = renderDataRoutes(rootRoutes, commonData, {
      routerProps: { initialEntries: [routes.main] },
      viewType,
    });

    const userEvent = setupUserEvent();
    const modalController = createTestModalController({ ...renderData, userEvent });
    return { modalController, ...renderData, userEvent };
  };

  return renderNormalLayout;
};
