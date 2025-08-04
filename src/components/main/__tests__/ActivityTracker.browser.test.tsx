import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { renderDataNode } from '@/tests/render/test-renderers';

import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import { ActivityTimeouts, useActivityTracker } from '../effects/ActivityTrackerEffect';
import { useSocket } from '@/context/SocketContext';
import SessionConstants from '@/constants/SessionConstants';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Input from '@/components/semantic/Input';

import * as API from '@/types/api';
import { getMockServer, MockServer } from '@/tests/mocks/mock-server';

// tslint:disable:no-empty
describe('ActivityTracker', () => {
  let server: MockServer;
  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();

    vi.useRealTimers();
  });

  const getSocket = async () => {
    const commonData = await initCommonDataMocks(server);

    const onActivity = vi.fn();
    server.addRequestHandler(
      'POST',
      SessionConstants.ACTIVITY_URL,
      undefined,
      onActivity,
    );

    return {
      onActivity,
      commonData,
      server,
    };
  };

  const ActivityTracker: React.FC<{ timeouts: ActivityTimeouts }> = ({ timeouts }) => {
    const socket = useSocket();
    useActivityTracker(socket, timeouts);
    return <Input placeholder="Input" autoFocus={true} />;
  };

  const renderTracker = async (timeouts: ActivityTimeouts, enableFakeTimers = false) => {
    const { commonData, ...other } = await getSocket();

    if (enableFakeTimers) {
      vi.useFakeTimers();
    }

    const renderData = renderDataNode(
      <ActivityTracker timeouts={timeouts} />,
      commonData,
    );

    return { ...renderData, ...commonData, ...other };
  };

  test('should detect user activity', async () => {
    const timeouts = {
      user: 10000,
      system: 10000000,
    };

    const { sessionStore, onActivity, getByRole } = await renderTracker(timeouts);

    // User not active by default
    expect(sessionStore.getState().activity.userActive).toBeFalsy();

    // Simulate user activity
    const user = userEvent.setup();
    user.click(getByRole('textbox'));

    await waitFor(() => expect(sessionStore.getState().activity.userActive).toBeTruthy());
    await waitFor(() => expect(onActivity).toBeCalledTimes(1));
  });

  test('should enable auto away', async () => {
    const timeouts = {
      user: 10000,
      system: 10000000,
    };

    const { sessionStore, onActivity, mockStoreListeners, getByRole } =
      await renderTracker(timeouts, true);

    // Set as active
    sessionStore.getState().activity.setUserActive(true);
    vi.runOnlyPendingTimers();

    // Simulate inactivity
    vi.advanceTimersByTime(timeouts.user + 10000);
    vi.runOnlyPendingTimers();
    mockStoreListeners.activity.awayState.fire({
      id: API.AwayEnum.IDLE,
    });

    expect(sessionStore.getState().activity.userActive).toBeFalsy();
    expect(sessionStore.getState().activity.away).toEqual(API.AwayEnum.IDLE);
    expect(onActivity).toBeCalledTimes(1);

    // Should remain inactive
    vi.advanceTimersByTime(timeouts.user + 10000);
    vi.runOnlyPendingTimers();

    expect(sessionStore.getState().activity.userActive).toBeFalsy();
    expect(onActivity).toBeCalledTimes(1);

    // Simulate user activity
    const user = userEvent.setup({ advanceTimers: vi.runOnlyPendingTimers });
    user.click(getByRole('textbox'));

    vi.runOnlyPendingTimers();

    await waitFor(() => expect(sessionStore.getState().activity.userActive).toBeTruthy());
    expect(onActivity).toBeCalledTimes(2);
  });
});
