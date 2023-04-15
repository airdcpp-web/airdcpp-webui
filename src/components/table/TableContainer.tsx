import PropTypes from 'prop-types';
import * as React from 'react';

import { Table, ColumnProps } from 'fixed-data-table-2';

import TableActions from 'actions/TableActions';
import { useMobileLayout } from 'utils/BrowserUtils';

import Measure, { ContentRect } from 'react-measure';
import RowWrapperCell from 'components/table/RowWrapperCell';
import { TextCell, HeaderCell } from 'components/table/Cell';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { textToI18nKey, toArray } from 'utils/TranslationUtils';

const TABLE_ROW_HEIGHT = 50;

function convertStartToRows(pixels: number) {
  return Math.max(Math.floor(pixels / TABLE_ROW_HEIGHT), 0);
}

function convertEndToRows(pixels: number) {
  return Math.ceil(pixels / TABLE_ROW_HEIGHT);
}

export type TableContainerProps = React.PropsWithChildren<{
  entityId?: API.IdType;
  rowClassNameGetter?: (rowData: any) => string;
  store: any;
  dataLoader: any;
  t: UI.TranslateF;
  moduleId: string | string[];
  viewId?: number | string;
}>;

interface State {
  width: number;
  height: number;
  columnWidths: Record<string, number>;
  isColumnResizing: boolean | undefined;
}

const formatColumnName = (
  column: React.ReactElement<ColumnProps>,
  store: any,
  moduleId: string | string[],
  t: UI.TranslateF
) => {
  const { name, columnKey } = column.props;
  let displayName = t(
    textToI18nKey(columnKey as string, [...toArray(moduleId), UI.SubNamespaces.TABLE]),
    name
  );

  {
    const sortDirArrow = store.sortAscending ? ' ↑' : ' ↓';
    displayName += store.sortProperty === columnKey ? sortDirArrow : '';
  }

  return displayName;
};

class TableContainer extends React.Component<TableContainerProps, State> {
  static propTypes = {
    /**
     * Store implementing ViewStoreMixin that contains the items
     */
    store: PropTypes.object.isRequired,

    /**
     * Append class names to row (takes row data as param)
     */
    rowClassNameGetter: PropTypes.func,

    /**
     * ID of the current entity for non-singleton sources
     */
    entityId: PropTypes.any,

    dataLoader: PropTypes.any.isRequired,
  };

  state: State = {
    width: 0,
    height: 0,
    columnWidths: {},
    isColumnResizing: undefined,
  };

  getInitialProps = () => {
    return {
      rowClassNameGetter: null,
      entityId: null,
    };
  };

  scrollTimer: number | undefined;
  scrollPosition = 0;
  setInitialScrollRow = true;

  // This will also be used for setting the initial rows
  componentDidUpdate(prevProps: TableContainerProps, prevState: State) {
    if (prevState.height !== this.state.height) {
      this.updateRowRange();
    } else if (
      prevProps.entityId !== this.props.entityId ||
      prevProps.viewId !== this.props.viewId
    ) {
      if (this.props.store.DEBUG) {
        console.log(
          `Enabling initial scroll, entity/viewId changed (view ${this.props.viewId})`
        );
      }

      this.setInitialScrollRow = true;
      this.updateRowRange();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.scrollTimer);
  }

  updateRowRange = () => {
    const { store } = this.props;
    const { height } = this.state;

    const startRows = convertStartToRows(this.scrollPosition);
    const maxRows = convertEndToRows(height);

    if (store.DEBUG) {
      // eslint-disable-next-line max-len
      console.log(
        `Settings changed, start: ${startRows}, end: ${maxRows}, height: ${height}`,
        store.viewName
      );
    }

    console.assert(store.active, 'Posting data for an inactive view');
    TableActions.setRange(store.viewUrl, startRows, maxRows);
  };

  onScrollStart = (horizontal: number, vertical: number) => {
    const { store } = this.props;

    if (store.DEBUG) {
      console.log(`Scrolling started: ${vertical}`, store.viewUrl);
    }

    console.assert(store.active, 'Sending pause for an inactive view');
    TableActions.pause(store.viewUrl, true);
  };

  onScrollEnd = (horizontal: number, vertical: number) => {
    const { store, viewId } = this.props;

    this.scrollPosition = vertical;
    console.assert(store.active, 'Sending pause for an inactive view');
    TableActions.pause(store.viewUrl, false);

    clearTimeout(this.scrollTimer);
    this.scrollTimer = window.setTimeout(this.updateRowRange, 500);

    if (this.setInitialScrollRow) {
      this.setInitialScrollRow = false;

      if (store.DEBUG) {
        console.log(`Disabling initial scroll (view ${viewId})`);
      }
    }

    store.setScrollData(vertical, viewId);
    if (store.DEBUG) {
      console.log(`Scrolling ended: ${vertical}`, store.viewUrl);
    }
  };

  onColumnClicked = (sortProperty: string) => {
    const { store } = this.props;

    let sortAscending = true;
    if (sortProperty === store.sortProperty && store.sortAscending) {
      sortAscending = false;
    }

    TableActions.setSort(this.props.store.viewUrl, sortProperty, sortAscending);
  };

  onColumnResizeEndCallback = (newColumnWidth: number, columnKey: string) => {
    this.setState(
      ({ columnWidths }) => ({
        columnWidths: {
          ...columnWidths,
          [columnKey]: newColumnWidth,
        },

        // In order to disable the resizing mode, the table needs to be rendered with "isColumnResizing: false"
        // Put it right back to undefined after that in order to avoid resizing issues
        // while the table is being re-rendered
        // https://github.com/schrodinger/fixed-data-table-2/issues/268
        // https://github.com/airdcpp-web/airdcpp-webclient/issues/444
        isColumnResizing: false,
      }),
      () => {
        this.setState({
          isColumnResizing: undefined,
        });
      }
    );
  };

  childToColumn = (column: React.ReactElement<ColumnProps>) => {
    if (!!column.props.hideWidth && column.props.hideWidth > this.state.width) {
      return null;
    }

    let { flexGrow, width } = column.props;
    const { cell, columnKey, renderCondition } = column.props;
    const { store, rowClassNameGetter, moduleId, t } = this.props;

    const mobileView = useMobileLayout();
    if (!mobileView) {
      // Get column width
      if (!!columnKey && !!this.state.columnWidths[columnKey]) {
        width = this.state.columnWidths[columnKey];
        flexGrow = undefined;
      }
    }

    return React.cloneElement(column, {
      header: (
        <HeaderCell
          onClick={this.onColumnClicked.bind(null, columnKey)}
          label={formatColumnName(column, store, moduleId, t)}
        />
      ),
      flexGrow,
      width,
      isResizable: !mobileView,
      allowCellsRecycling: true,
      cell: (
        <RowWrapperCell
          dataLoader={this.props.dataLoader}
          renderCondition={renderCondition}
          rowClassNameGetter={rowClassNameGetter}
          t={t}
        >
          {cell ? (cell as React.ReactElement<any>) : <TextCell />}
        </RowWrapperCell>
      ),
    });
  };

  onResizeView = (contentRect: ContentRect) => {
    if (!contentRect.bounds) {
      return;
    }

    // Bounds may contain incorrect (or outdated) dimensions with animations (such as when opening a modal)
    const { width, height } = !!contentRect.entry
      ? contentRect.entry
      : contentRect.bounds;
    this.setState({
      width,
      height,
    });
  };

  render() {
    // Update and insert generic columns props
    const children = React.Children.map(this.props.children, this.childToColumn);

    const { width, height, isColumnResizing } = this.state;
    const { store, viewId } = this.props;
    return (
      <Measure bounds={true} onResize={this.onResizeView}>
        {({ measureRef }) => (
          <div ref={measureRef} className="table-container-wrapper">
            <Table
              width={width}
              height={height}
              rowHeight={50}
              rowsCount={store.rowCount}
              headerHeight={50}
              isColumnResizing={isColumnResizing}
              onColumnResizeEndCallback={this.onColumnResizeEndCallback}
              touchScrollEnabled={true}
              onScrollStart={this.onScrollStart}
              onScrollEnd={this.onScrollEnd}
              scrollTop={
                this.setInitialScrollRow ? store.getScrollData(viewId) : undefined
              }
            >
              {children}
            </Table>
          </div>
        )}
      </Measure>
    );
  }
}

export default TableContainer;
