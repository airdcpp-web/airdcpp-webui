import {
  createMemoryRouter,
  MemoryRouterOpts,
  RouteObject,
  RouterProvider,
} from 'react-router';

import { APISocket } from '@/services/SocketService';
import { render, screen } from '@testing-library/react';

import '@/utils/semantic';

import { MODAL_PAGE_DIMMER_ID } from '@/components/semantic/effects/useModal';
import { createFormatter } from '@/utils/Formatter';
import { getMockI18n } from '../mocks/mock-i18n';
import { getMockSession } from '../mocks/mock-session';
import { createAppStore } from '@/stores';
import { appendInstanceId, generateInstanceId } from '@/context/InstanceContext';
import { BaseTestWrapper, SessionTestWrapper } from './test-containers';

export const renderBaseNode = (node: React.ReactNode, wrapper?: React.ComponentType) => {
  // Create container
  const container = document.createElement('div');

  const instanceId = generateInstanceId();
  container.setAttribute('id', appendInstanceId(MODAL_PAGE_DIMMER_ID, instanceId));

  window.dispatchEvent(new Event('resize'));

  // Initializers
  const i18n = getMockI18n();
  const formatter = createFormatter(i18n);

  const testHelpers = render(node, {
    container: document.body.appendChild(container),
    wrapper: (props) => (
      <BaseTestWrapper
        wrapper={wrapper}
        i18n={i18n}
        formatter={formatter}
        instanceId={instanceId}
        {...props}
      />
    ),
  });

  return {
    ...testHelpers,
    screen,
    formatter,
  };
};

export const renderDataNode = (node: React.ReactNode, socket: APISocket) => {
  // Session
  const session = getMockSession();
  const appStore = createAppStore();

  const container = ({ children }: React.PropsWithChildren) => (
    <SessionTestWrapper session={session} socket={socket} store={appStore}>
      {children}
    </SessionTestWrapper>
  );

  const testHelpers = renderBaseNode(node, container);

  return {
    ...testHelpers,
    session,
  };
};

interface RouteRenderOptions {
  routerProps?: MemoryRouterOpts;
}

export const renderBasicRoutes = (routes: RouteObject[], options: RouteRenderOptions) => {
  const { routerProps = { initialEntries: ['/'] } } = options;

  const router = createMemoryRouter(routes, routerProps);

  const testHelpers = renderBaseNode(<RouterProvider router={router} />);
  return {
    ...testHelpers,
    router,
  };
};

interface DataRouteRenderOptions extends RouteRenderOptions {
  socket: APISocket;
}

export const renderDataRoutes = (
  routes: RouteObject[],
  options: DataRouteRenderOptions,
) => {
  const { socket, routerProps = { initialEntries: ['/'] } } = options;

  const router = createMemoryRouter(routes, routerProps);

  const testHelpers = renderDataNode(<RouterProvider router={router} />, socket);
  return {
    ...testHelpers,
    router,
  };
};

export type BaseRenderResult = ReturnType<typeof renderBaseNode>;
export type DataRenderResult = ReturnType<typeof renderDataNode>;

export type BasicRouteRenderResult = ReturnType<typeof renderBasicRoutes>;
export type DataRouteRenderResult = ReturnType<typeof renderDataRoutes>;
