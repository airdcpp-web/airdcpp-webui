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
import { appendInstanceId, generateInstanceId } from '@/context/InstanceContext';
import { BaseTestWrapper, SessionTestWrapper } from './test-containers';

import * as UI from '@/types/ui';
import { StoreApi } from 'zustand';

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

interface DataProps {
  session: UI.AuthenticatedSession;
  store: StoreApi<UI.Store>;
  socket: APISocket;
}

export const renderDataNode = (
  node: React.ReactNode,
  { session, store, socket }: DataProps,
) => {
  // Session
  // const session = getMockSession();
  // const appStore = createAppStore();

  const container = ({ children }: React.PropsWithChildren) => (
    <SessionTestWrapper session={session} socket={socket} store={store}>
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

type DataRouteRenderOptions = RouteRenderOptions;

export const renderDataRoutes = (
  routes: RouteObject[],
  dataProps: DataProps,
  options: DataRouteRenderOptions,
) => {
  const { routerProps = { initialEntries: ['/'] } } = options;

  const router = createMemoryRouter(routes, routerProps);

  const testHelpers = renderDataNode(<RouterProvider router={router} />, dataProps);
  return {
    ...testHelpers,
    router,
  };
};

export type BaseRenderResult = ReturnType<typeof renderBaseNode>;
export type DataRenderResult = ReturnType<typeof renderDataNode>;

export type BasicRouteRenderResult = ReturnType<typeof renderBasicRoutes>;
export type DataRouteRenderResult = ReturnType<typeof renderDataRoutes>;
