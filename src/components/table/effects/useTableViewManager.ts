import * as React from 'react';

import TableActions from '@/actions/TableActions';

import * as API from '@/types/api';

import { useSocket } from '@/context/SocketContext';
import useMeasure from 'react-use-measure';

const TABLE_ROW_HEIGHT = 50;

function convertStartToRows(pixels: number) {
  return Math.max(Math.floor(pixels / TABLE_ROW_HEIGHT), 0);
}

function convertEndToRows(pixels: number) {
  return Math.ceil(pixels / TABLE_ROW_HEIGHT);
}

export type TableViewManagerProps = {
  // ID of the current entity for non-singleton sources
  entityId?: API.IdType;

  // Store implementing ViewStoreMixin that contains the items
  store: any;

  // Possible ID of the current view (items will be cleared when the ID changes)
  viewId?: number | string;
};

type ColumnWidths = Record<string, number>;

export const useTableViewManager = ({
  store,
  viewId,
  entityId,
}: TableViewManagerProps) => {
  const socket = useSocket();

  const setInitialScrollRow = React.useRef(true);
  const [measureRef, bounds] = useMeasure({
    debounce: setInitialScrollRow.current ? 0 : 100,
  });

  const [columnWidths, setColumnWidths] = React.useState<ColumnWidths>({});

  const scrollTimer = React.useRef<number | undefined>(undefined);
  const scrollPosition = React.useRef(0);

  React.useEffect(() => {
    if (bounds.height > 0) {
      updateRowRange();
    }
  }, [bounds.height]);

  React.useEffect(() => {
    return () => {
      clearTimeout(scrollTimer.current);
    };
  }, []);

  React.useEffect(() => {
    if (bounds.height === 0) {
      return;
    }

    if (store.DEBUG) {
      console.log(`Enabling initial scroll, entity/viewId changed (view ${viewId})`);
    }

    setInitialScrollRow.current = true;
    updateRowRange();
  }, [entityId, viewId]);

  const updateRowRange = () => {
    const { height } = bounds;

    const startRows = convertStartToRows(scrollPosition.current);
    const maxRows = convertEndToRows(height);

    if (store.DEBUG) {
      console.log(
        `Settings changed, start: ${startRows}, end: ${maxRows}, height: ${height}`,
        store.viewName,
      );
    }

    console.assert(store.active, 'Posting data for an inactive view');
    TableActions.setRange(socket, store.viewUrl, startRows, maxRows);
  };

  const onScrollStart = (horizontal: number, vertical: number) => {
    if (store.DEBUG) {
      console.log(`Scrolling started: ${vertical}`, store.viewUrl);
    }

    console.assert(store.active, 'Sending pause for an inactive view');
    TableActions.pause(socket, store.viewUrl, true);
  };

  const onScrollEnd = (horizontal: number, vertical: number) => {
    scrollPosition.current = vertical;
    console.assert(store.active, 'Sending pause for an inactive view');
    TableActions.pause(socket, store.viewUrl, false);

    clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(updateRowRange, 500);

    if (setInitialScrollRow.current) {
      setInitialScrollRow.current = false;

      if (store.DEBUG) {
        console.log(`Disabling initial scroll (view ${viewId})`);
      }
    }

    store.setScrollData(vertical, viewId);
    if (store.DEBUG) {
      console.log(`Scrolling ended: ${vertical}`, store.viewUrl);
    }
  };

  const onColumnClicked = (sortProperty: string) => {
    let sortAscending = true;
    if (sortProperty === store.sortProperty && store.sortAscending) {
      sortAscending = false;
    }

    TableActions.setSort(socket, store.viewUrl, sortProperty, sortAscending);
  };

  const onColumnResizeEndCallback = (newColumnWidth: number, columnKey: string) => {
    setColumnWidths((prevWidths) => ({
      ...prevWidths,
      [columnKey]: newColumnWidth,
    }));
  };

  const getScrollTop = () => {
    return setInitialScrollRow.current ? store.getScrollData(viewId) : undefined;
  };

  return {
    measureRef,
    getScrollTop,

    columnWidths,
    bounds,

    onColumnClicked,
    onColumnResizeEndCallback,

    onScrollStart,
    onScrollEnd,

    updateRowRange,
  };
};
