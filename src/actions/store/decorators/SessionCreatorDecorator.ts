import { APISocket } from '@/services/SocketService';

import NotificationActions from '@/actions/NotificationActions';

import * as UI from '@/types/ui';

import { ErrorResponse } from 'airdcpp-apisocket';

export type CreateSessionProps = Pick<
  UI.ActionHandlerProps,
  'navigate' | 'sessionStore' | 'socket'
>;

interface SessionActionCreatorProps<
  SessionT extends UI.SessionType,
  ItemDataT extends object,
> {
  onExists?: (
    sessionItem: SessionT,
    itemData: ItemDataT,
    socket: APISocket,
  ) => void | Promise<void>;
  existingSessionGetter: (
    itemData: ItemDataT,
    sessionStore: UI.SessionStore,
  ) => SessionT | undefined;
  sectionUrlPath: string;
  createHandler: (data: ItemDataT, socket: APISocket) => Promise<SessionT>;
}

export const SessionCreatorDecorator = <
  SessionT extends UI.SessionType,
  ItemDataT extends object,
>({
  onExists,
  sectionUrlPath,
  existingSessionGetter,
  createHandler,
}: SessionActionCreatorProps<SessionT, ItemDataT>) => {
  const createSession = async (
    itemData: ItemDataT,
    {
      navigate,
      sessionStore,
      socket,
    }: Partial<UI.ActionHandlerProps> & CreateSessionProps,
  ) => {
    const onCreated = (sessionItem: SessionT) => {
      navigate(`${sectionUrlPath}/session/${sessionItem.id}`, {
        state: {
          pending: true,
        },
      });
    };

    let session = existingSessionGetter(itemData, sessionStore);
    if (session) {
      if (onExists) {
        await onExists(session, itemData, socket);
      }

      onCreated(session);
      return;
    }

    try {
      session = await createHandler(itemData, socket);
    } catch (e) {
      const error = e as ErrorResponse;
      NotificationActions.apiError('Failed to create session', error);
      return;
    }

    onCreated(session);
  };

  return createSession;
};
