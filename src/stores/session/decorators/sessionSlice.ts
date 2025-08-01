import { Draft, produce } from 'immer';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { getItemUrgencies, getSessionUrgencies } from '@/utils/UrgencyUtils';
import { checkUnreadSessionInfo } from '@/utils/MessageUtils';
import { APISocket } from '@/services/SocketService';
import { Lens } from '@dhmk/zustand-lens';

export type SessionUrgencyCountMapper<SessionT extends UI.SessionType> = (
  sessionItem: SessionT,
) => UI.ChatMessageUrcencies | UI.StatusMessageUrcencies;
interface Readable {
  setRead?: UI.SessionReadHandler;
}

export const createSessionSlice = <SessionT extends UI.SessionType>(
  messageUrgencyMappings: SessionUrgencyCountMapper<SessionT> | undefined = undefined,
) => {
  type State = UI.SessionSlice<SessionT> & Readable;

  const createSlice: Lens<State & Readable, UI.SessionStore> = (set, get, api) => {
    const isUnreadUpdate = (updatedProperties: Partial<SessionT>) => {
      return updatedProperties.message_counts || updatedProperties.hasOwnProperty('read');
    };

    const checkReadState = (
      id: API.IdType,
      updatedProperties: Partial<SessionT>,
    ): Partial<SessionT> => {
      // Active tab? Mark as read
      if (
        id === get().activeSessionId &&
        api.getState().activity.userActive &&
        isUnreadUpdate(updatedProperties)
      ) {
        const ret = checkUnreadSessionInfo(updatedProperties as UI.UnreadInfo, () => {
          const readCallback = get().setRead;
          if (readCallback) {
            readCallback({ id });
          } else {
            console.error('Session store not initialized');
          }
        });

        return ret as Partial<SessionT>;
      }

      return updatedProperties;
    };

    const slice = {
      sessions: null,
      activeSessionId: null,
      setRead: undefined,

      init: (data: SessionT[]) =>
        set(() => ({
          sessions: data,
        })),

      createSession: (data: SessionT) => {
        set(
          produce<State>((state) => {
            if (!state.sessions) {
              return;
            }

            state.sessions.push(data as Draft<SessionT>);
          }),
        );
      },

      updateSession: (
        updatedPropertiesInitial: Partial<SessionT>,
        sessionId: API.IdType | undefined,
      ) =>
        set(
          produce<State>((state) => {
            const id = updatedPropertiesInitial.id
              ? updatedPropertiesInitial.id
              : sessionId!;

            const session = state.getSession(id);
            if (!session) {
              // May happen before the sessions have been fetched
              console.warn(
                `Update received for a non-existing session ${id}`,
                updatedPropertiesInitial,
              );
              return;
            }

            const updatedProperties = checkReadState(id, updatedPropertiesInitial);
            const { sessions } = get();
            if (!sessions) {
              return;
            }

            const index = sessions.indexOf(session);
            console.assert(index !== -1, 'Session not found', id, sessions);

            state.sessions![index] = {
              ...state.sessions![index],
              ...updatedProperties,
            };
          }),
        ),

      removeSession: (data: SessionT) => {
        set(
          produce<State>((state) => {
            const { sessions } = get();
            if (!sessions) {
              return;
            }

            const session = state.getSession(data.id);
            if (!session) {
              return;
            }

            const index = sessions.indexOf(session);
            console.assert(index !== -1, 'Session not found', data.id, sessions);
            state.sessions!.splice(index, 1);
          }),
        );
      },

      setActiveSession: (sessionItem: SessionT | null) =>
        set(() => ({
          activeSessionId: sessionItem ? sessionItem.id : null,
        })),

      getItemUrgencies: (item: SessionT) => {
        return getItemUrgencies(item, messageUrgencyMappings);
      },

      getTotalUrgencies: () => {
        const { sessions } = get();
        if (!sessions) {
          return null;
        }

        return getSessionUrgencies(sessions, get().getItemUrgencies);
      },

      getSession: (id: API.IdType) => {
        const { sessions } = get();
        if (!sessions) {
          return undefined;
        }

        return sessions.find((session) => session.id === id);
      },

      setReadHandler: (handler: UI.SessionReadHandler) => {
        set(() => ({
          setRead: handler,
        }));
      },
    };

    return slice;
  };

  return createSlice;
};

type SetReadAction = (id: UI.SessionItemBase, socket: APISocket) => Promise<any>;

interface SessionActions<SessionT extends UI.SessionType> {
  setRead: SetReadAction;
  fetchSessions: (
    sessionSlice: UI.SessionSlice<SessionT>,
    socket: APISocket,
  ) => Promise<void>;
}

export const initSessionSlice = async <SessionT extends UI.SessionType>(
  sessionSlice: UI.SessionSlice<SessionT>,
  sessionActions: SessionActions<SessionT>,
  { addSocketListener, socket }: UI.SessionInitData,
) => {
  await addSocketListener(`created`, sessionSlice.createSession);
  await addSocketListener(`updated`, sessionSlice.updateSession);
  await addSocketListener(`removed`, sessionSlice.removeSession);

  sessionSlice.setReadHandler((session) => {
    sessionActions.setRead(session, socket).catch((error) => {
      console.error(`Failed to mark session ${session.id} as read`, error);
    });
  });
};
