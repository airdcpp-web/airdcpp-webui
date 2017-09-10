import React from 'react';
import PropTypes from 'prop-types';


// Generic wrapper for all cells that will handle data loading
const RowWrapperCell = React.createClass({
  propTypes: {
    rowIndex: PropTypes.number, // required
    dataLoader: PropTypes.object.isRequired,
    width: PropTypes.number, // required
  },

  getInitialState() {
    return {
      rowData: null,
    };
  },

  componentDidMount() {
    this.loadData(this.props.rowIndex);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.rowIndex !== this.props.rowIndex) {
      // Remove pending update callbacks to avoid rendering each of them when the data is received
      // (there can be lots of pending requests when scrolling for long distances)
      this.props.dataLoader.removePendingRequests(this.props.rowIndex, this.onDataLoaded);
    }

    // Check if there is new data available (rowIndex may have changed as well)
    if (!this.loadData(nextProps.rowIndex)) {
      // Avoid displaying old data
      this.setState({ rowData: null });
    }
  },

  componentWillUnmount() {
    this.props.dataLoader.removePendingRequests(this.props.rowIndex, this.onDataLoaded);
  },

  loadData(rowIndex) {
    return this.props.dataLoader.updateRowData(rowIndex, this.onDataLoaded);
  },

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.rowData !== this.state.rowData || 
   nextProps.width !== this.props.width;
  },

  rowDataGetter() {
    return this.state.rowData;
  },

  onDataLoaded(data) {
    this.setState({ rowData: data });
  },

  render() {
    const { columnKey, children, renderCondition, rowClassNameGetter, ...other } = this.props;
    const { rowData } = this.state;

    if (!rowData) {
      return null;
    }

    if (renderCondition && !renderCondition(rowData[columnKey], rowData)) {
      return null;
    }

    let className = columnKey;
    if (rowClassNameGetter) {
      className += ' ' + rowClassNameGetter(rowData);
    }

    return (
      <div className={ 'cell-wrapper ' + className }>
        { React.cloneElement(children, {
          cellData: rowData[columnKey],

          // Don't pass the actual row data to allow cells to skip 
          // re-rendering using shallow equality checks when the row data is 
          // updated without leaving them with an outdated item data
          rowDataGetter: this.rowDataGetter,
          ...other,
        }) }
      </div>
    );
  }
});

export default RowWrapperCell;