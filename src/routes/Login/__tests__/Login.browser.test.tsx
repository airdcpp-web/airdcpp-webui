import { waitFor } from '@testing-library/dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { getMockServer, getSocket } from 'airdcpp-apisocket/tests';

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
import { LOGIN_PROPS_KEY, REFRESH_TOKEN_KEY } from '@/stores/app/loginSlice';
import { saveLocalProperty, saveSessionProperty } from '@/utils/BrowserUtils';
import { getMockSession } from '@/tests/mocks/mock-session';

const AuthResponse = getMockSession([]);
const { refresh_token, ...ConnectResponse } = AuthResponse;

const ChildRouteUrl = '/child';
const ChildRouteCaption = 'Go to child';

// tslint:disable:no-empty
describe('Login', () => {
  let server: ReturnType<typeof getMockServer>;

  const addSuccessCredentialAuthHandlers = () => {
    const onLogin = vi.fn();
    const onLogout = vi.fn();

    server.addRequestHandler('POST', 'sessions/authorize', AuthResponse, onLogin);

    server.addRequestHandler('DELETE', 'sessions/self', undefined, onLogout);

    return { onLogin, onLogout };
  };

  const renderPage = async (initialRoute = '/login') => {
    const { socket } = getSocket({
      reconnectInterval: 0.1,
      logLevel: 'none',
      autoReconnect: false,
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
        addMockSessionStoreSocketListeners(server);
        addMockSessionStoreInitDataHandlers(server);
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
        routerProps: { initialEntries: [initialRoute] },
      },
      undefined,
      SocketWrapper,
    );

    const onSocketConnected = vi.fn();
    socket.onConnected = onSocketConnected;

    return { socket, onSocketConnected, ...renderData };
  };

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();

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
    const authHandlerData = addSuccessCredentialAuthHandlers();

    const renderData = await renderPage();

    const { router, findAllByText } = renderData;
    await fillAndSubmitLogin(renderData);
    await waitForUrl('/', router);
    await waitFor(() => expect(findAllByText('Logged in')).toBeTruthy());

    return { ...renderData, ...authHandlerData };
  };

  describe('credentials', () => {
    test('should handle login', async () => {
      const userEvent = setupUserEvent();

      const { getByText, socket, onLogin, onLogout, onSocketConnected, appStore } =
        await doInitialLogin();

      await waitFor(() => expect(onSocketConnected).toHaveBeenCalledWith(AuthResponse));
      await waitFor(() => {
        expectResponseToMatchSnapshot(onLogin);
      });

      userEvent.click(getByText('Logout'));
      await waitFor(() => {
        expectResponseToMatchSnapshot(onLogout);
      });

      expect(socket.isConnected()).toBe(false);
      expect(appStore.getState().login.getSession()).toBeNull();
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
        ConnectResponse,
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

      saveLocalProperty(REFRESH_TOKEN_KEY, AuthResponse.refresh_token);

      socket.onConnect = () => {
        // Let it fail reconnect
        server.addErrorHandler(
          'POST',
          'sessions/socket',
          'Invalid session token',
          400,
          onReconnectSocket,
        );
      };

      // Disconnect socket
      socket.disconnect();

      await waitFor(() =>
        expect(appStore.getState().login.socketAuthenticated).toBeFalsy(),
      );

      await waitFor(() => expect(getByRole('progressbar')).toBeTruthy());
      await waitFor(() => expect(onReconnectSocket).toBeCalled());

      // We should be back on the login page
      await waitForUrl('/login', router);
      expect(appStore.getState().login.getSession()).toBeNull();

      // Refresh token should now be attempted
      server.addErrorHandler(
        'POST',
        'sessions/authorize',
        'Invalid refresh token',
        400,
        onAuth,
      );

      await waitFor(() => expect(onAuth).toBeCalled());

      // Refresh token should now be removed
      await waitFor(() => expect(appStore.getState().login.getRefreshToken()).toBeNull());

      // Re-login
      addSuccessCredentialAuthHandlers();
      await fillAndSubmitLogin(renderData);

      // The previously active page should be visible
      await waitForUrl(ChildRouteUrl, router);
    }, 100000);

    test('should connect with an existing session', async () => {
      saveSessionProperty(LOGIN_PROPS_KEY, AuthResponse);

      const onReconnectSocket = vi.fn();
      server.addRequestHandler(
        'POST',
        'sessions/socket',
        ConnectResponse,
        onReconnectSocket,
      );

      const { appStore, router } = await renderPage(ChildRouteUrl);

      await waitFor(() =>
        expect(appStore.getState().login.socketAuthenticated).toBeTruthy(),
      );

      expectResponseToMatchSnapshot(onReconnectSocket);

      await waitForUrl(ChildRouteUrl, router);
    }, 100000);
  });

  describe('refresh token', () => {
    test('should use refresh token with an expired session', async () => {
      const onReconnectSocket = vi.fn();
      saveSessionProperty(LOGIN_PROPS_KEY, AuthResponse);
      saveLocalProperty(REFRESH_TOKEN_KEY, AuthResponse.refresh_token);

      server.addErrorHandler(
        'POST',
        'sessions/socket',
        'Invalid session token',
        400,
        onReconnectSocket,
      );

      const onLogin = vi.fn();

      const { appStore, router, socket } = await renderPage(ChildRouteUrl);
      socket.onConnect = () => {
        // Handlers will be reset when the reconnect fails and socket gets disconnected
        server.addRequestHandler('POST', 'sessions/authorize', ConnectResponse, onLogin);
      };

      // Reconnect should fail
      await waitFor(() => expect(onReconnectSocket).toBeCalled());

      // We should be back on the login page
      await waitForUrl('/login', router);
      await waitFor(() =>
        expect(appStore.getState().login.socketAuthenticated).toBeTruthy(),
      );

      // Refresh token should be used for authorization and we are now back on the page that we originally wanted
      await waitForUrl(ChildRouteUrl, router);
      expectResponseToMatchSnapshot(onLogin);

      await waitForUrl(ChildRouteUrl, router);
    }, 100000);
  });
});
