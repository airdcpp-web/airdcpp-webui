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
  // Base
  const windowSize = 2000;

  Object.assign(window, {
    innerWidth: windowSize,
    innerHeight: windowSize,
    outerWidth: windowSize,
    outerHeight: windowSize,
  }).dispatchEvent(new Event('resize'));

  const instanceId = generateInstanceId();

  const container = document.createElement('div');
  container.setAttribute('id', appendInstanceId(MODAL_PAGE_DIMMER_ID, instanceId));

  const containerWidth = `${windowSize}px`;
  const containerHeight = `${windowSize}px`;

  container.setAttribute('width', containerWidth);
  container.setAttribute('height', containerHeight);

  document.body.setAttribute('height', containerHeight);
  document.body.setAttribute('width', containerWidth);

  const i18n = getMockI18n();
  const formatter = createFormatter(i18n);

  const testHelpers = render(node, {
    container: document.body.appendChild(container),
    wrapper: (props) => (
      <BaseTestWrapper
        // socket={socket}
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

  /*const testHelpers = render(node, {
    container: document.body.appendChild(container),
    wrapper: (props) => (
      <TestWrapper
        socket={socket}
        i18n={i18n}
        formatter={formatter}
        session={session}
        store={appStore}
        instanceId={instanceId}
        {...props}
      />
    ),
  });*/

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
