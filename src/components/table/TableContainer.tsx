import PropTypes from 'prop-types';
import React from 'react';

import { TFunction } from 'i18next';

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

export interface TableContainerProps {
  entityId?: API.IdType;
  rowClassNameGetter?: (rowData: any) => string;
  store: any;
  dataLoader: any;
  t: TFunction;
  moduleId: string | string[];
}

interface State {
  width: number;
  height: number;
  columnWidths: object;
}


const formatColumnName = (
  column: React.ReactElement<ColumnProps>, 
  store: any, 
  moduleId: string | string[], 
  t: TFunction
) => {
  const { name, columnKey } = column.props;
  let displayName = t(
    textToI18nKey(columnKey as string, [ ...toArray(moduleId), UI.SubNamespaces.TABLE ]),
    name
  );

  {
    const sortDirArrow = store.sortAscending ? ' ↑' : ' ↓';
    displayName += ((store.sortProperty === columnKey) ? sortDirArrow : '');
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
  };

  getInitialProps = () => {
    return {
      rowClassNameGetter: null,
      entityId: null
    };
  }

  scrollTimer: NodeJS.Timer;
  scrollPosition = 0;

  // This will also be used for setting the initial rows
  componentDidUpdate(prevProps: TableContainerProps, prevState: State) {
    if (prevState.height !== this.state.height) {
      this.updateRowRange();
    } else if (prevProps.entityId !== this.props.entityId) {
      this.updateRowRange();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.scrollTimer);
  }

  updateRowRange = () => {
    const startRows = convertStartToRows(this.scrollPosition);
    const maxRows = convertEndToRows(this.state.height);

    // tslint:disable-next-line:max-line-length
    //console.log('Settings changed, start: ' + startRows + ', end: ' + maxRows, ', height: ' + this.state.height, this.props.store.viewName);

    //console.assert(this.props.store.active, 'Posting data for an inactive view');
    TableActions.setRange(this.props.store.viewUrl, startRows, maxRows);
  }

  onScrollStart = (horizontal: number, vertical: number) => {
    //console.log('Scrolling started: ' + vertical, this.props.store.viewUrl);
    console.assert(this.props.store.active, 'Sending pause for an inactive view');
    TableActions.pause(this.props.store.viewUrl, true);
  }

  onScrollEnd = (horizontal: number, vertical: number) => {
    this.scrollPosition = vertical;
    console.assert(this.props.store.active, 'Sending pause for an inactive view');
    TableActions.pause(this.props.store.viewUrl, false);

    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(this.updateRowRange, 500);
    //console.log('Scrolling ended: ' + vertical, this.props.store.viewUrl);
  }

  onColumnClicked = (sortProperty: string) => {
    const { store } = this.props;

    let sortAscending = true;
    if (sortProperty === store.sortProperty && store.sortAscending) {
      sortAscending = false;
    }

    TableActions.setSort(this.props.store.viewUrl, sortProperty, sortAscending);
  }

  onColumnResizeEndCallback = (newColumnWidth: number, columnKey: string) => {
    this.setState(({ columnWidths }) => ({
      columnWidths: {
        ...columnWidths,
        [columnKey]: newColumnWidth,
      }
    }));
  }

  childToColumn = (column: React.ReactElement<ColumnProps>) => {
    if (!!column.props.hideWidth && column.props.hideWidth > this.state.width) {
      return null;
    }

    let { flexGrow, width, cell, columnKey, renderCondition } = column.props;
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
          onClick={ this.onColumnClicked.bind(null, columnKey) } 
          label={ formatColumnName(column, store, moduleId, t) }
        />
      ),
      flexGrow,
      width,
      isResizable: !mobileView,
      allowCellsRecycling: true,
      cell: (			
        <RowWrapperCell 
          dataLoader={ this.props.dataLoader } 
          renderCondition={ renderCondition } 
          rowClassNameGetter={ rowClassNameGetter }
          t={ t }
        >
          { cell ? cell as React.ReactElement<any> : <TextCell/> }
        </RowWrapperCell>
      ),
    });
  }

  onResizeView = (contentRect: ContentRect) => {
    if (!contentRect.bounds) {
      return;
    }

    // Bounds may contain incorrect (or outdated) dimensions with animations (such as when opening a modal)
    const { width, height } = !!contentRect.entry ? contentRect.entry : contentRect.bounds;
    this.setState({
      width,
      height,
    });
  }

  render() {
    // Update and insert generic columns props
    const children = React.Children.map(this.props.children, this.childToColumn);

    return (
      <Measure 
        bounds={ true }
        onResize={ this.onResizeView }
      >
        { ({ measureRef }) => (
          <div 
            ref={ measureRef } 
            className="table-container-wrapper"
          >
            <Table
              width={ this.state.width }
              height={ this.state.height } 

              rowHeight={ 50 }
              rowsCount={ this.props.store.rowCount }
              headerHeight={ 50 }
              isColumnResizing={ false }
              onColumnResizeEndCallback={ this.onColumnResizeEndCallback }

              touchScrollEnabled={ true }

              onScrollStart={ this.onScrollStart }
              onScrollEnd={ this.onScrollEnd }
            >
              { children }
            </Table>
          </div>
        ) }
      </Measure>
    );
  }
}

export default TableContainer;