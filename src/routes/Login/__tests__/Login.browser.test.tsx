import { waitFor } from '@testing-library/dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
  DEFAULT_AUTH_RESPONSE,
  DEFAULT_CONNECT_PARAMS,
  DEFAULT_CONNECT_RESPONSE,
  getMockServer,
  getSocket,
} from 'airdcpp-apisocket/tests';

import { renderBasicRoutes } from '@/tests/render/test-renderers';

import {
  setInputFieldValuesByPlaceholder,
  setupUserEvent,
} from '@/tests/helpers/test-form-helpers';
import Login from '../components/Login';
import {
  clickButton,
  expectResponseToMatchSnapshot,
  waitForUrl,
} from '@/tests/helpers/test-helpers';
import { getLogoutItem, parseMenuItem } from '@/routes/Routes';
import { useAppStore } from '@/context/AppStoreContext';
import { SocketContext } from '@/context/SocketContext';
import AuthenticationGuardDecorator from '@/components/main/decorators/AuthenticationGuardDecorator';
import {
  addMockSessionStoreInitDataHandlers,
  addMockSessionStoreSocketListeners,
} from '@/tests/mocks/mock-store';
import { useLayoutEffect } from 'react';
import { TestRouteNavigateButton } from '@/tests/helpers/test-route-helpers';

const ChildRouteUrl = '/child';
const ChildRouteCaption = 'Go to child';

// tslint:disable:no-empty
describe('Login', () => {
  let server: ReturnType<typeof getMockServer>;

  const addSuccessLoginHandlers = () => {
    const onLogin = vi.fn();
    const onLogout = vi.fn();

    server.addRequestHandler(
      'POST',
      'sessions/authorize',
      DEFAULT_AUTH_RESPONSE,
      onLogin,
    );

    server.addRequestHandler('DELETE', 'sessions/self', undefined, onLogout);

    return { onLogin, onLogout };
  };

  const renderPage = async () => {
    const { socket } = getSocket({
      ...DEFAULT_CONNECT_PARAMS,
      reconnectInterval: 0.1,
      // logLevel: 'verbose',
    });

    const SocketWrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
      <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );

    const LoginPageTest = () => {
      return <Login />;
    };

    const LoggedInPageContent = AuthenticationGuardDecorator(() => {
      const appStore = useAppStore();
      return (
        <div>
          <div>Logged in</div>
          {parseMenuItem(getLogoutItem(socket, appStore))}
          <TestRouteNavigateButton route={ChildRouteUrl} caption={ChildRouteCaption} />
        </div>
      );
    });

    const LoggedInPage = () => {
      const appStore = useAppStore();
      useLayoutEffect(() => {
        const { clearSessionMockListeners } = addMockSessionStoreSocketListeners(server);
        const removeGetters = addMockSessionStoreInitDataHandlers(server);
        return () => {
          clearSessionMockListeners();
          removeGetters();
        };
      }, [appStore.login.socketAuthenticated]);

      return <LoggedInPageContent />;
    };

    const routes = [
      {
        path: '/login/*',
        Component: LoginPageTest,
      },
      {
        index: true,
        Component: LoggedInPage,
      },
      {
        path: '/child/*',
        Component: LoggedInPage,
      },
    ];

    const renderData = renderBasicRoutes(
      routes,
      {
        routerProps: { initialEntries: ['/login'] },
      },
      undefined,
      SocketWrapper,
    );

    return { socket, ...renderData };
  };

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  const fillAndSubmitLogin = async ({
    getByRole,
    getByPlaceholderText,
    appStore,
  }: Awaited<ReturnType<typeof renderPage>>) => {
    // Check content
    await waitFor(() => expect(getByRole('form')).toBeTruthy(), {
      timeout: 10000,
    });

    // Edit
    const userEvent = setupUserEvent();
    await setInputFieldValuesByPlaceholder(
      { userEvent, getByPlaceholderText },
      {
        Username: 'testuser',
        Password: 'testpassword',
      },
    );

    // Submit
    const button = getByRole('button', { name: 'Login' });
    await userEvent.click(button);

    await waitFor(() =>
      expect(appStore.getState().login.socketAuthenticated).toBeTruthy(),
    );
  };

  const doInitialLogin = async () => {
    const { onLogin, onLogout } = addSuccessLoginHandlers();

    const renderData = await renderPage();

    const { router, socket } = renderData;
    const onSocketConnected = vi.fn();
    socket.onConnected = onSocketConnected;

    await fillAndSubmitLogin(renderData);

    await waitForUrl('/', router);
    return { ...renderData, onLogin, onLogout, onSocketConnected };
  };

  describe('credentials', () => {
    test('should handle login', async () => {
      const userEvent = setupUserEvent();

      const { getByText, socket, onLogin, onLogout, onSocketConnected } =
        await doInitialLogin();

      await waitFor(() =>
        expect(onSocketConnected).toHaveBeenCalledWith(DEFAULT_AUTH_RESPONSE),
      );
      await waitFor(() => {
        expectResponseToMatchSnapshot(onLogin);
      });

      userEvent.click(getByText('Logout'));
      await waitFor(() => {
        expectResponseToMatchSnapshot(onLogout);
      });

      expect(socket.isConnected()).toBe(false);
    }, 100000);

    test('should handle invalid credentials', async () => {
      const userEvent = setupUserEvent();

      const onLoginFailed = vi.fn();
      server.addErrorHandler(
        'POST',
        'sessions/authorize',
        'Invalid username or password',
        401,
        onLoginFailed,
      );

      const { getByRole, getByText, getByPlaceholderText } = await renderPage();

      // Check content
      await waitFor(() => expect(getByRole('form')).toBeTruthy());

      // Edit
      await setInputFieldValuesByPlaceholder(
        { userEvent, getByPlaceholderText },
        {
          Username: 'invalid',
          Password: 'invalid',
        },
      );

      // Submit
      const button = getByRole('button', { name: 'Login' });
      await userEvent.click(button);

      await waitFor(() => {
        expect(
          getByText('Authentication failed: Invalid username or password'),
        ).toBeTruthy();
      });
    }, 100000);
  });

  describe('reconnect', () => {
    test('should reconnect socket', async () => {
      const onReconnectSocket = vi.fn();

      const { getByRole, socket, appStore, router } = await doInitialLogin();

      clickButton(ChildRouteCaption, getByRole);
      await waitForUrl(ChildRouteUrl, router);

      // Disconnect socket
      socket.disconnect();

      await waitFor(() =>
        expect(appStore.getState().login.socketAuthenticated).toBeFalsy(),
      );

      // Let it reconnect
      server.addRequestHandler(
        'POST',
        'sessions/socket',
        DEFAULT_CONNECT_RESPONSE,
        onReconnectSocket,
      );

      await waitFor(() => expect(getByRole('progressbar')).toBeTruthy());

      await waitFor(() => {
        expect(appStore.getState().login.socketAuthenticated).toBeTruthy();
      });

      expectResponseToMatchSnapshot(onReconnectSocket);

      await waitForUrl(ChildRouteUrl, router);
    }, 100000);

    test('should handle reconnect errors', async () => {
      const onReconnectSocket = vi.fn();
      const onAuth = vi.fn();

      const renderData = await doInitialLogin();

      const { getByRole, socket, appStore, router } = renderData;

      clickButton(ChildRouteCaption, getByRole);
      await waitForUrl(ChildRouteUrl, router);

      // Disconnect socket
      socket.disconnect();

      await waitFor(() =>
        expect(appStore.getState().login.socketAuthenticated).toBeFalsy(),
      );

      // Let it fail reconnect
      server.addErrorHandler(
        'POST',
        'sessions/socket',
        'Invalid session token',
        400,
        onReconnectSocket,
      );

      server.addErrorHandler(
        'POST',
        'sessions/authorize',
        'Invalid refresh token',
        400,
        onAuth,
      );

      await waitFor(() => expect(getByRole('progressbar')).toBeTruthy());

      // We should be back on the login page
      await waitForUrl('/login', router);

      // Re-login
      addSuccessLoginHandlers();
      await fillAndSubmitLogin(renderData);

      // The previously active page should be visible
      await waitForUrl(ChildRouteUrl, router);
    }, 100000);
  });
});
