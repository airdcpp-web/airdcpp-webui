import { SubscriptionCallback, SubscriptionRemoveHandler } from 'airdcpp-apisocket';

import * as API from 'types/api';
import * as UI from 'types/ui';

export type AddSessionSliceListener = (
  listenerName: string,
  callback: SubscriptionCallback,
) => Promise<void>;

export const createSessionSliceSocketListener = (
  { socket, login }: UI.StoreInitData,
  moduleUrl: string,
  listenerPrefix: string,
  access: API.AccessEnum,
) => {
  const addSessionSliceListener: AddSessionSliceListener = async (
    listenerName,
    callback,
  ) => {
    if (login.hasAccess(access)) {
      await socket.addListener(moduleUrl, `${listenerPrefix}_${listenerName}`, callback);
    }
  };

  return addSessionSliceListener;
};
