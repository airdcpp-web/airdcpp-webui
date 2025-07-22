import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { getMockSession } from '@/tests/mocks/mock-session';

import { getConnectedSocket, getMockServer } from 'airdcpp-apisocket/tests';

import { addMockStoreSocketListeners } from '@/tests/mocks/mock-store';
import {
  EventMessageError,
  EventMessageInfo,
  EventMessagesResponse,
} from '@/tests/mocks/api/events';
import { createSessionStore } from '@/stores/session';
import { toEventCacheMessage } from '@/stores/session/eventSlice';

describe('event store', () => {
  let server: ReturnType<typeof getMockServer>;
  beforeEach(() => {
    server = getMockServer();
  });

  afterEach(() => {
    server.stop();
  });

  const createMockAppStore = (initProps: UI.SessionStoreInitData) => {
    const appStore = createSessionStore();
    const mocks = addMockStoreSocketListeners(appStore, initProps, server);

    return { appStore, mocks };
  };

  const initStore = async () => {
    const { socket } = await getConnectedSocket(server);
    const initProps = {
      login: getMockSession(),
      socket,
    };

    const { appStore, mocks } = createMockAppStore(initProps);
    return { appStore, mocks };
  };

  const addMessages = (
    events: ReturnType<typeof addMockStoreSocketListeners>['events'],
  ) => {
    events.message.fire(EventMessageInfo);
    events.message.fire(EventMessageError);
  };

  test('should add individual messages', async () => {
    const {
      appStore,
      mocks: { events },
    } = await initStore();

    addMessages(events);

    expect(appStore.getState().events.logMessages).toEqual(
      (EventMessagesResponse as API.StatusMessage[]).map(toEventCacheMessage),
    );
    expect(appStore.getState().events.isInitialized).toBeFalsy();
  });
});
