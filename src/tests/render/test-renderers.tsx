import {
  createMemoryRouter,
  MemoryRouterOpts,
  RouteObject,
  RouterProvider,
} from 'react-router';

import { APISocket } from '@/services/SocketService';
import { render, screen } from '@testing-library/react';

import { MODAL_PAGE_DIMMER_ID } from '@/components/semantic/effects/useModal';
import { createFormatter } from '@/utils/Formatter';
import { getMockI18n } from '../mocks/mock-i18n';
import {
  appendInstanceId,
  generateInstanceId,
  UIInstanceId,
} from '@/context/InstanceContext';
import {
  BaseTestWrapper,
  SessionTestWrapper,
  VIEW_SCROLLABLE,
  ViewType,
} from './test-containers';

import * as UI from '@/types/ui';
import { StoreApi } from 'zustand';
import { createAppStore } from '@/stores/app';

export interface BaseRenderProps {
  appStore: StoreApi<UI.AppStore>;
}

export const getTestPageId = (instanceId: UIInstanceId) => {
  return `#${appendInstanceId(MODAL_PAGE_DIMMER_ID, instanceId)}`;
};

export const renderBaseNode = (
  node: React.ReactNode,
  viewType = VIEW_SCROLLABLE,
  { appStore }: BaseRenderProps = { appStore: createAppStore() },
  wrapper?: React.ComponentType,
) => {
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
        appStore={appStore}
        viewType={viewType}
        {...props}
      />
    ),
  });

  return {
    ...testHelpers,
    screen,
    formatter,
    appStore,
    i18n,
    instanceId,
  };
};

interface DataProps extends BaseRenderProps {
  sessionStore: StoreApi<UI.SessionStore>;
  socket: APISocket;
}

export const renderDataNode = (
  node: React.ReactNode,
  { sessionStore, socket, ...other }: DataProps,
  viewType = VIEW_SCROLLABLE,
) => {
  const container = ({ children }: React.PropsWithChildren) => (
    <SessionTestWrapper socket={socket} sessionStore={sessionStore}>
      {children}
    </SessionTestWrapper>
  );

  const testHelpers = renderBaseNode(node, viewType, other, container);

  return {
    ...testHelpers,
  };
};

interface RouteRenderOptions {
  routerProps?: MemoryRouterOpts;
  viewType?: ViewType;
}

export const renderBasicRoutes = (
  routes: RouteObject[],
  routeOptions: RouteRenderOptions,
  baseOptions?: BaseRenderProps,
  wrapper?: React.ComponentType,
) => {
  const { viewType, routerProps = { initialEntries: ['/'] } } = routeOptions;

  const router = createMemoryRouter(routes, routerProps);

  const testHelpers = renderBaseNode(
    <RouterProvider router={router} />,
    viewType,
    baseOptions,
    wrapper,
  );
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
  const { viewType, routerProps = { initialEntries: ['/'] } } = options;

  const router = createMemoryRouter(routes, routerProps);

  const testHelpers = renderDataNode(
    <RouterProvider router={router} />,
    dataProps,
    viewType,
  );
  return {
    ...testHelpers,
    router,
  };
};

export type BaseRenderResult = ReturnType<typeof renderBaseNode>;
export type DataRenderResult = ReturnType<typeof renderDataNode>;

export type BasicRouteRenderResult = ReturnType<typeof renderBasicRoutes>;
export type DataRouteRenderResult = ReturnType<typeof renderDataRoutes>;
