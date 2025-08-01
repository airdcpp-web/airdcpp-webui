import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { getMockSession } from '@/tests/mocks/mock-session';

import { getConnectedSocket, getMockServer } from 'airdcpp-apisocket/tests';

import { initMockSessionStore } from '@/tests/mocks/mock-store';
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

  const createMockSessionStore = async (initProps: UI.SessionStoreInitData) => {
    const sessionStore = createSessionStore();
    const mocks = await initMockSessionStore(sessionStore, initProps, server);

    return { sessionStore, mocks };
  };

  const initStore = async () => {
    const { socket } = await getConnectedSocket(server);
    const initProps = {
      login: getMockSession(),
      socket,
    };

    const { sessionStore, mocks } = await createMockSessionStore(initProps);
    return { sessionStore, mocks };
  };

  const addMessages = (
    events: Awaited<ReturnType<typeof initMockSessionStore>>['events'],
  ) => {
    events.message.fire(EventMessageInfo);
    events.message.fire(EventMessageError);
  };

  test('should add individual messages', async () => {
    const {
      sessionStore,
      mocks: { events },
    } = await initStore();

    addMessages(events);

    expect(sessionStore.getState().events.logMessages).toEqual(
      (EventMessagesResponse as API.StatusMessage[]).map(toEventCacheMessage),
    );
    expect(sessionStore.getState().events.isInitialized).toBeFalsy();
  });
});
