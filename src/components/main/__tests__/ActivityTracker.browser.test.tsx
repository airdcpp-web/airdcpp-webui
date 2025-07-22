import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { renderDataNode } from '@/tests/render/test-renderers';

import { getMockServer } from 'airdcpp-apisocket/tests';

import { initCommonDataMocks } from '@/tests/mocks/mock-data-common';
import { ActivityTimeouts, useActivityTracker } from '../ActivityTracker';
import { useSocket } from '@/context/SocketContext';
import SessionConstants from '@/constants/SessionConstants';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Input from '@/components/semantic/Input';

// tslint:disable:no-empty
describe('ActivityTracker', () => {
  let server: ReturnType<typeof getMockServer>;
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

  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
    localStorage.clear();

    vi.useRealTimers();
  });

  test('should detect user activity', async () => {
    const timeouts = {
      user: 10000,
      system: 10000000,
    };

    const { sessionStore, onActivity } = await renderTracker(timeouts);

    // User not active by default
    expect(sessionStore.getState().activity.userActive).toBeFalsy();

    // Simulate user activity
    const user = userEvent.setup();
    await user.keyboard('test');

    await waitFor(() => expect(sessionStore.getState().activity.userActive).toBeTruthy());
    expect(onActivity).toBeCalledTimes(1);
  });

  test('should enable auto away', async () => {
    const timeouts = {
      user: 10000,
      system: 10000000,
    };

    const { sessionStore, onActivity } = await renderTracker(timeouts, true);

    // Set as active
    sessionStore.getState().activity.setUserActive(true);
    vi.runOnlyPendingTimers();

    // Simulate inactivity
    vi.advanceTimersByTime(timeouts.user + 10000);
    vi.runOnlyPendingTimers();

    expect(sessionStore.getState().activity.userActive).toBeFalsy();
    expect(onActivity).toBeCalledTimes(1);
  });
});
