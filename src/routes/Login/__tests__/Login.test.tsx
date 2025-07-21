import { waitFor } from '@testing-library/dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
  DEFAULT_AUTH_RESPONSE,
  DEFAULT_CONNECT_PARAMS,
  getMockServer,
  getSocket,
} from 'airdcpp-apisocket/tests';

import { renderBasicRoutes } from '@/tests/render/test-renderers';

import {
  setInputFieldValuesByPlaceholder,
  setupUserEvent,
} from '@/tests/helpers/test-form-helpers';
import Login from '../components/Login';
import { expectResponseToMatchSnapshot, waitForUrl } from '@/tests/helpers/test-helpers';
import { getLogoutItem, parseMenuItem } from '@/routes/Routes';

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
    const { socket } = getSocket(DEFAULT_CONNECT_PARAMS);

    const LoginPageTest = () => {
      return <Login />;
    };

    const routes = [
      {
        path: '/login/*',
        Component: LoginPageTest,
      },
      {
        index: true,
        Component: () => (
          <div>
            <div>Logged in</div>
            {parseMenuItem(getLogoutItem(socket))}
          </div>
        ),
      },
    ];

    const renderData = renderBasicRoutes(routes, {
      routerProps: { initialEntries: ['/login'] },
    });

    return { socket, ...renderData };
  };

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  test.skip('should handle login', async () => {
    const userEvent = setupUserEvent();

    const { onLogin, onLogout } = addSuccessLoginHandlers();
    const { getByRole, getByPlaceholderText, router, getByText, socket } =
      await renderPage();

    // Check content
    await waitFor(() => expect(getByRole('form')).toBeTruthy());

    // Edit
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

    await waitForUrl('/', router);

    await waitFor(() => {
      expectResponseToMatchSnapshot(onLogin);
    });

    userEvent.click(getByText('Logout'));
    await waitFor(() => {
      expectResponseToMatchSnapshot(onLogout);
    });

    expect(socket.isConnected()).toBe(false);
  }, 100000);

  test.skip('should handle invalid credentials', async () => {
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
