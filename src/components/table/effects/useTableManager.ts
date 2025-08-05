import { useEffect, useMemo, useReducer, useRef } from 'react';

import TableActions from '@/actions/TableActions';

// import TableFooter, { TableFooterProps } from './TableFooter';
// import TableContainer, { TableContainerProps } from './TableContainer';
import RowDataLoader from '../RowDataLoader';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { useSocket } from '@/context/SocketContext';
import { useAppStoreProperty } from '@/context/AppStoreContext';

export interface TableManagerProps {
  store: any;

  // Store containing sessions (must be provided together with entityId)
  sessionStore?: UI.SessionSlice<UI.SessionItem>;

  entityId?: API.IdType | undefined;

  sourceFilter?: API.TableFilter;
}

export const useTableManager = ({
  store,
  sessionStore,
  entityId,
  sourceFilter,
}: TableManagerProps) => {
  const socket = useSocket();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const socketAuthenticated = useAppStoreProperty(
    (store) => store.login.socketAuthenticated,
  );
  const dataLoader = useMemo(
    () => new RowDataLoader(store, forceUpdate, socket),
    [store],
  );

  const unsubscribe = useRef<() => void>(() => {});

  useEffect(() => {
    unsubscribe.current = store.listen(dataLoader.onItemsUpdated.bind(dataLoader));
    return () => {
      unsubscribe.current();
    };
  }, [dataLoader, store]);

  const moduleExists = (entityId: API.IdType | undefined) => {
    if (!socketAuthenticated) {
      return false;
    }

    if (!entityId || !sessionStore) {
      return true;
    }

    return sessionStore.getSession(entityId);
  };

  const start = (/*entityId: API.IdType | undefined*/) => {
    TableActions.init(socket, store.viewUrl, entityId, sourceFilter);
    TableActions.setSort(socket, store.viewUrl, store.sortProperty, store.sortAscending);
  };

  const close = () => {
    // Don't send the close command if the session was removed
    TableActions.close(socket, store.viewUrl, moduleExists(entityId));
  };

  useEffect(() => {
    start();
    return () => {
      close();
    };
  }, [entityId, socketAuthenticated]);

  useEffect(() => {
    if (store.paused) {
      // We need to receive the new items
      TableActions.pause(socket, store.viewUrl, false, socket);
    }

    TableActions.clear(socket, store.viewUrl);
  }, [store.paused, store.viewUrl]);

  return dataLoader;
};
