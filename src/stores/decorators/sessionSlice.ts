import { Draft, produce } from 'immer';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { getItemUrgencies, getSessionUrgencies } from 'utils/UrgencyUtils';
import { checkUnreadSessionInfo } from 'utils/MessageUtils';
import { APISocket } from 'services/SocketService';
import { AddSessionSliceListener } from './sliceSocketListener';

export type SessionUrgencyCountMapper<SessionT extends UI.SessionType> = (
  session: SessionT,
) => UI.ChatMessageUrcencies | UI.StatusMessageUrcencies;

type SetRead = (id: UI.SessionItemBase, socket: APISocket) => void;

export const createSessionSlice = <SessionT extends UI.SessionType>(
  { socket }: UI.StoreInitData,
  setRead: SetRead,
  addSocketListener: AddSessionSliceListener,
  messageUrgencyMappings: SessionUrgencyCountMapper<SessionT> | undefined = undefined,
) => {
  type State = UI.SessionSlice<SessionT>;

  const createSlice: UI.LensSlice<UI.SessionSlice<SessionT>, State, UI.Store> = (
    set,
    get,
    api,
  ) => {
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
        const ret = checkUnreadSessionInfo(updatedProperties as UI.UnreadInfo, () =>
          setRead({ id }, socket),
        );

        return ret as Partial<SessionT>;
      }

      return updatedProperties;
    };

    const slice = {
      sessions: [],
      activeSessionId: null,

      init: (data: SessionT[]) =>
        set(() => ({
          sessions: data,
        })),

      isInitialized: () => !!get().sessions,

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
                'Update received for a non-existing session',
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

      setActiveSession: (session: SessionT | null) =>
        set(() => ({
          activeSessionId: session ? session.id : null,
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
    };

    addSocketListener(`created`, slice.createSession);
    addSocketListener(`updated`, slice.updateSession);
    addSocketListener(`removed`, slice.removeSession);
    return slice;
  };

  return createSlice;
};
