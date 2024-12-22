import { createMemoryRouter, RouteObject, RouterProvider } from 'react-router';
import { SocketContext } from 'context/SocketContext';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { APISocket } from 'services/SocketService';
import { render, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { DEFAULT_AUTH_RESPONSE } from 'airdcpp-apisocket/tests/helpers.js';

import 'utils/semantic';

import translations from '../../resources/locales/en/webui.main.json';
import { i18nOptions } from 'services/LocalizationService';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { AuthenticatedSession, SessionContext } from 'context/SessionContext';

import * as API from 'types/api';
import {
  MODAL_NODE_ID,
  MODAL_PAGE_DIMMER_ID,
} from 'components/semantic/effects/useModal';

const getMockI18n = () => {
  i18n.use(initReactI18next).init({
    lng: 'en',
    debug: false,
    resources: { en: translations },
    ...i18nOptions,
  });

  return i18n;
};

type TestWrapperProps = PropsWithChildren<{
  socket: APISocket;
}>;

export const MOCK_SESSION: AuthenticatedSession = {
  systemInfo: {
    ...DEFAULT_AUTH_RESPONSE.system,
    api_version: 1,
    api_feature_level: 9,
    client_version: '2.13.2',
    client_started: 252352355,
  } as API.SystemInfo,
  user: DEFAULT_AUTH_RESPONSE.user as API.LoginUser,
  authToken: DEFAULT_AUTH_RESPONSE.auth_token,
  sessionId: 4,

  hasAccess: () => true,
};

export const TestWrapper: React.FC<TestWrapperProps> = ({ children, socket }) => {
  const i18n = getMockI18n();
  return (
    <ErrorBoundary>
      <SocketContext.Provider value={socket}>
        <I18nextProvider i18n={i18n}>
          <SessionContext.Provider value={MOCK_SESSION}>
            <section
              className="ui dimmable blurring minimal"
              id="container-main"
              style={{ height: '100%', width: '100%' }}
            >
              {children}
            </section>
            <div id={MODAL_NODE_ID} className={`ui dimmer ${MODAL_NODE_ID}`} />
          </SessionContext.Provider>
        </I18nextProvider>
      </SocketContext.Provider>
    </ErrorBoundary>
  );
};

interface RenderOptions {
  socket: APISocket;
  routerProps?: object & {
    initialEntries: string[];
  };
}

export const renderRoutes = (routes: RouteObject[], options: RenderOptions) => {
  const { socket, routerProps = { initialEntries: ['/'] }, ...otherOptions } = options;

  const router = createMemoryRouter(routes, routerProps);

  const container = document.createElement('div');
  container.setAttribute('id', MODAL_PAGE_DIMMER_ID);

  container.setAttribute('width', '2000px');
  container.setAttribute('height', '2000px');

  document.body.setAttribute('height', '2000px');
  document.body.setAttribute('width', '2000px');

  const testHelpers = render(<RouterProvider router={router} />, {
    container: document.body.appendChild(container),
    wrapper: (props) => <TestWrapper socket={socket} {...props} />,
    ...otherOptions,
  });

  return {
    ...testHelpers,
    screen,
    router,
  };
};
