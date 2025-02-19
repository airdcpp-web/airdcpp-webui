import { createMemoryRouter, RouteObject, RouterProvider } from 'react-router';
import { SocketContext } from 'context/SocketContext';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { APISocket } from 'services/SocketService';
import { render, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';

import 'utils/semantic';

import { ErrorBoundary } from 'components/ErrorBoundary';
import { SessionContext } from 'context/SessionContext';

import * as UI from 'types/ui';

import {
  MODAL_NODE_ID,
  MODAL_PAGE_DIMMER_ID,
} from 'components/semantic/effects/useModal';
import { createFormatter } from 'utils/Formatter';
import { FormatterContext } from 'context/FormatterContext';
import { getMockI18n } from './mocks/mock-i18n';
import { getMockSession } from './mocks/mock-session';
import { StoreContext } from 'context/StoreContext';
import { StoreApi } from 'zustand';
import { createAppStore } from 'stores';

type TestWrapperProps = PropsWithChildren<{
  socket: APISocket;
  formatter: ReturnType<typeof createFormatter>;
  i18n: typeof i18n;
  session: UI.AuthenticatedSession;
  store: StoreApi<UI.Store>;
}>;

export const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  socket,
  i18n,
  formatter,
  session,
  store,
}) => {
  return (
    <ErrorBoundary>
      <FormatterContext.Provider value={formatter}>
        <SocketContext.Provider value={socket}>
          <I18nextProvider i18n={i18n}>
            <SessionContext.Provider value={session}>
              <StoreContext.Provider value={store}>
                <section
                  className="ui dimmable blurring minimal"
                  id="container-main"
                  style={{ height: '100%', width: '100%' }}
                >
                  {children}
                </section>
                <div id={MODAL_NODE_ID} className={`ui dimmer ${MODAL_NODE_ID}`} />
              </StoreContext.Provider>
            </SessionContext.Provider>
          </I18nextProvider>
        </SocketContext.Provider>
      </FormatterContext.Provider>
    </ErrorBoundary>
  );
};

export const renderNode = (node: React.ReactNode, socket: APISocket) => {
  const windowSize = 2000;

  Object.assign(window, {
    innerWidth: windowSize,
    innerHeight: windowSize,
    outerWidth: windowSize,
    outerHeight: windowSize,
  }).dispatchEvent(new Event('resize'));

  const container = document.createElement('div');
  container.setAttribute('id', MODAL_PAGE_DIMMER_ID);

  container.setAttribute('width', '100%');
  container.setAttribute('height', '100%');

  document.body.setAttribute('height', '100%');
  document.body.setAttribute('width', '100%');

  const i18n = getMockI18n();
  const formatter = createFormatter(i18n);
  const session = getMockSession();
  const appStore = createAppStore();

  const testHelpers = render(node, {
    container: document.body.appendChild(container),
    wrapper: (props) => (
      <TestWrapper
        socket={socket}
        i18n={i18n}
        formatter={formatter}
        session={session}
        store={appStore}
        {...props}
      />
    ),
  });

  return {
    ...testHelpers,
    screen,
    formatter,
    session,
  };
};

interface RouteRenderOptions {
  socket: APISocket;
  routerProps?: object & {
    initialEntries: string[];
  };
}

export const renderRoutes = (routes: RouteObject[], options: RouteRenderOptions) => {
  const { socket, routerProps = { initialEntries: ['/'] } } = options;

  const router = createMemoryRouter(routes, routerProps);

  const testHelpers = renderNode(<RouterProvider router={router} />, socket);
  return {
    ...testHelpers,
    router,
  };
};

export type NodeRenderResult = ReturnType<typeof renderNode>;
export type RouteRenderResult = ReturnType<typeof renderRoutes>;
