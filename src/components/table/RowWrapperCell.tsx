import * as React from 'react';
import { CellProps } from 'fixed-data-table-2';

import * as UI from '@/types/ui';
import classNames from 'classnames';

export interface RowWrapperCellChildProps<
  CellDataT,
  RowDataT extends UI.ActionMenuItemDataValueType,
> extends CellProps {
  cellData?: CellDataT;
  rowDataGetter?: () => RowDataT;
  rowData?: RowDataT;
  t?: UI.TranslateF;
}

export interface RowWrapperCellProps extends CellProps {
  dataLoader: any;

  renderCondition?: (columnData: any, rowData: any) => boolean;
  rowClassNameGetter?: (rowData: any) => string;
  columnKey?: string; // REQUIRED, CLONED

  children: React.ReactElement<any>;
  t: UI.TranslateF;
}

interface State {
  rowData: any;
}

// Generic wrapper for all cells that will handle data loading
class RowWrapperCell extends React.Component<RowWrapperCellProps> {
  state: State = {
    rowData: null,
  };

  componentDidMount() {
    this.loadData(this.props.rowIndex!);
  }

  componentDidUpdate(prevProps: RowWrapperCellProps) {
    if (prevProps.rowIndex !== this.props.rowIndex) {
      this.props.dataLoader.removePendingRequests(prevProps.rowIndex, this.onDataLoaded);
    }

    if (!this.loadData(this.props.rowIndex!)) {
      this.setState({ rowData: null });
    }
  }

  componentWillUnmount() {
    this.props.dataLoader.removePendingRequests(this.props.rowIndex, this.onDataLoaded);
  }

  loadData = (rowIndex: number) => {
    return this.props.dataLoader.updateRowData(rowIndex, this.onDataLoaded);
  };

  shouldComponentUpdate(nextProps: RowWrapperCellProps, nextState: State) {
    return (
      nextState.rowData !== this.state.rowData || nextProps.width !== this.props.width
    );
  }

  rowDataGetter = () => {
    return this.state.rowData;
  };

  onDataLoaded = (data: any) => {
    this.setState({ rowData: data });
  };

  render() {
    const { columnKey, children, renderCondition, rowClassNameGetter, ...other } =
      this.props;
    const { rowData } = this.state;

    if (!rowData) {
      return null;
    }

    if (renderCondition && !renderCondition(rowData[columnKey!], rowData)) {
      return null;
    }

    const className = classNames(
      'cell-wrapper',
      columnKey,
      rowClassNameGetter ? rowClassNameGetter(rowData) : undefined,
    );

    return (
      <div className={className}>
        {React.cloneElement(children, {
          cellData: rowData[columnKey!],

          // Don't pass the actual row data to allow cells to skip
          // re-rendering using shallow equality checks when the row data is
          // updated without leaving them with an outdated item data
          rowDataGetter: this.rowDataGetter,
          ...other,
        })}
      </div>
    );
  }
}

export default RowWrapperCell;
