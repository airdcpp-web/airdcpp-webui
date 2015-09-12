import React from 'react';
import Reflux from 'reflux';
import FixedDataTable, { Table, Column } from 'fixed-data-table'
import SetContainerSize from './SetContainerSize'
import TouchScrollArea  from './TouchScrollArea';

import SocketService from '../../services/SocketService'
import SocketStore from '../../stores/SocketStore'
import TableActions from '../../actions/TableActions'

import { Input } from 'react-semantify'
import _ from 'lodash';

var NUMBER_OF_ROWS_PER_REQUEST = 5;
var TABLE_ROW_HEIGHT = 50;

var {PropTypes} = React;

// This will handle fetching only when scrolling. Otherwise the data will be updated through the socket listener.
class RowDataLoader {
  constructor(store, onDataLoad) {
    this._onDataLoad = onDataLoad;
    this._store = store;
    this._queue = [];
    this._data = [];
    this._fetchingActive = false;
  }

  set items(items) {
    // Don't force update if nothing has changed in the array
    let equal = items.every((element, index, array) => {
      return _.isEqual(element, this._data[index]);
    }, this);

    if (!equal) {
      this._data = _.map(items, _.clone);
      //this._data = items.slice(0);
      //this._data = Object.assign({ __proto__: obj.__proto__ }, items);
      this._onDataLoad();      
    }
  }

  set fetchingActive(value) {
    this._fetchingActive = value;
  }
  
  getRowData(rowIndex) {
    if (!this._data[rowIndex]) {
      if (this._fetchingActive) {
        this._queueRequestFor(rowIndex);
      }
      return undefined;
    }
    
    return this._data[rowIndex];
  }
  
  clearRowData(rowIndex) {
    delete this._data[rowIndex];
    this._onDataLoad();
  }
  
  _queueRequestFor(rowIndex) {
    this._queue.push(rowIndex);
    
    if (!this._queueFlushID) {
      this._queueFlushID = setTimeout(this._flushRequestQueue.bind(this), 0);
    }
  }
  
  _flushRequestQueue() {
    var sectionsToLoad = this._queue.reduce((requestSections, rowIndex) => {
      var rowBase = rowIndex - (rowIndex % NUMBER_OF_ROWS_PER_REQUEST);
      if (requestSections.indexOf(rowBase) === -1) {
        return requestSections.concat(rowBase);
      }
      
      return requestSections;
    }, []);
    
    sectionsToLoad.forEach(rowBase => {
      this._loadDataRange(
        rowBase,
        Math.min(rowBase + NUMBER_OF_ROWS_PER_REQUEST, this._store.rowCount)
      );    
    }, this);
    
    this._queue = [];
    this._queueFlushID = null;
  }
    
  _loadDataRange(rowStart, rowEnd) {
    SocketService.get(this._store.apiUrl + "/" + this._store.viewName + "/items/" + rowStart + "/" + rowEnd)
    //TableActions.getItems(this._store.apiUrl, this._store.viewName, rowStart, rowEnd)
      .then(data => {
        //Array.prototype.splice.apply(this._data, [rowStart, 0].concat(data));
        //Object.assign(this._data, data);

        for (var i=0; i < data.length; i++) {
           this._data[rowStart+i] = data[i];
        }

        this._onDataLoad();
      }.bind(this))
      .catch(error => 
        console.log("Failed to load data: " + error, this.props.viewName)
      );
  }
}

function convertStartToRows(pixels) {
  return Math.min(Math.floor(pixels / TABLE_ROW_HEIGHT), 0);
}

function convertEndToRows(pixels) {
  return Math.ceil(pixels / TABLE_ROW_HEIGHT);
}

var FilterBox = React.createClass({
  componentWillMount() {
    this._timer = null;
  },
  handleChange: function(event) {
    if (this._timer != null) {
      clearTimeout(this._timer);
    }

    this._timer = setTimeout(() => {
      this._timer = null;
      this.props.updateFunction(event.target.value);
    }, 200);
  },

  render: function() {
    return (
      <Input onChange={this.handleChange} className="exampleinput" placeholder="Filter..." type="text">

      </Input>
    );
  }
});

export default React.createClass({
  mixins: [SetContainerSize],

  propTypes: {

    /**
     * Store implementing ViewStoreMixin that contains the items
     */
    store: PropTypes.object.isRequired,

    /**
     * Store implementing ViewStoreMixin that contains the items
     */
    defaultSortProperty: PropTypes.string.isRequired,

    /**
     * Sort ascening by default
     */
    defaultSortAscending: PropTypes.bool
  },

  getInitialState() {
    return {
      sortProperty: this.props.defaultSortProperty,
      sortAscending: this.props.defaultSortAscending !== undefined ? this.props.defaultSortAscending : true
    };
  },
  componentWillUpdate(nextProps, nextState) {
    if (nextState.height != this.state.height || 
      nextState.sortAscending != this.state.sortAscending ||
      nextState.sortProperty != this.state.sortProperty) {

      setTimeout(this.updateTableSettings, 0);
    }
  },
  onItemsUpdated(items) {
    this._dataLoader.items = items;
  },
  componentDidMount() {
    this.unsubscribe = this.props.store.listen(this.onItemsUpdated);

    // https://github.com/facebook/react-native/issues/953
    //setTimeout(this.updateTableSettings);
  },
  updateTableSettings() {
    //var height = React.findDOMNode(this.refs.table).offsetHeight;

    //var height = this.state.contentHeight;

    var startRows = convertStartToRows(this._scrollPosition);
    var endRows = startRows + convertEndToRows(this.state.height, true);

    console.log("Settings changed, start: " + startRows + ", end: " + endRows, ", height: " + this.state.height, this.props.store.viewName);
    TableActions.changeSettings(this.props.store.apiUrl, this.props.store.viewName, startRows, endRows, this.state.sortProperty, this.state.sortAscending);
  },
  componentWillUnmount() {
    TableActions.close(this.props.store.apiUrl, this.props.store.viewName);
    this.unsubscribe();
  },

  componentWillMount() {
    this._columnWidths = { };
    this._isColumnResizing = false;
    this._scrollPosition = 0;
    this._dataLoader = new RowDataLoader(this.props.store, () => this.forceUpdate() );
  },

  _rowGetter(rowIndex) {
    return this._dataLoader.getRowData(rowIndex);
  },
  
  _clearDataForRow(rowIndex) {
    this._dataLoader.clearRowData(rowIndex);
  },
  
  _renderButton(_1, _2, _3, rowIndex) {
    return (<button style={{width: '100%'}} onClick={this._clearDataForRow.bind(null, rowIndex)}>clear data</button>);
  },

  _onScrollStart(horizontal, vertical) {
    //scrollTimer = setInterval(function () {myTimer()}, 1000);
    this._dataLoader.fetchingActive = true;
    //console.log("Scrolling started: " + vertical, this.props.store.viewName);
    TableActions.pause(this.props.store.apiUrl, this.props.store.viewName, true);
  },

  _onScrollEnd(horizontal, vertical) {
    this._scrollPosition = vertical;
    this._dataLoader.fetchingActive = false;
    TableActions.pause(this.props.store.apiUrl, this.props.store.viewName, false);
    this.updateTableSettings();
    //console.log("Scrolling ended: " + vertical, this.props.store.viewName);
  },

  _sortRowsBy(cellDataKey) {
    var newState = {
      sortProperty: cellDataKey,
      sortAscending: true
    };

    if (cellDataKey === this.state.sortProperty) {
      newState["sortAscending"] = this.state.sortAscending ? false : true;
    }

    this.setState(newState);
  },

  _renderHeader(label, cellDataKey) {
    return (
      <a onClick={this._sortRowsBy.bind(null, cellDataKey)}>{label}</a>
    );
  },

  _onColumnResizeEndCallback(newColumnWidth, dataKey) {
    this._columnWidths[dataKey] = newColumnWidth;
    this._isColumnResizing = false;
    this.forceUpdate(); // don't do this, use a store and put into this.state!
  },

  _setFilter(pattern) {
    TableActions.filter(this.props.store.apiUrl, this.props.store.viewName, pattern);
  },

  _footerDataGetter() {
    return (
      <FilterBox updateFunction={ this._setFilter }/>
    );
  },

  // Fitted-table
  _onContentHeightChange : function(contentHeight) {
    setTimeout(() => {
      var width = 0;
      React.Children.forEach(this.props.children, function(child){
        if ('width' in child.props){
          width = width + child.props.width;
        }
      });
      this.refs.touchScrollArea._onContentDimensionsChange(this.state.width, this.state.height, width, contentHeight);
    });
  },

  // Fitted-table
  handleScroll : function(left, top){
    this.setState({
      top: top,
      left: left
    });
  },
  
  render: function() {
    let sortDirArrow = this.state.sortAscending ? ' ↑' : ' ↓';

    // Update and insert generic columns props
    let children = React.Children.map(this.props.children, (column) => {
      let label = column.props.label + ((this.state.sortProperty === column.props.dataKey) ? sortDirArrow : '');
      let flexGrow = undefined;
      let width = undefined;
      if (this._columnWidths[column.props.dataKey] != undefined) {
        width = this._columnWidths[column.props.dataKey];
      } else {
        flexGrow = column.props.flexGrow;
        width = column.props.width;
      }

      return React.cloneElement(column, {
        headerRenderer: this._renderHeader,
        label: label,
        flexGrow: flexGrow,
        width: width,
        isResizable: true
      });
    }, this);

    var controlledScrolling = this.state.left !== undefined || this.state.top !== undefined;
    return (
      <TouchScrollArea handleScroll={this.handleScroll} ref='touchScrollArea' onScrollStart={this._onScrollStart} onScrollEnd={this._onScrollEnd}>
        <Table
          ref="table"

          width={this.state.width}
          height={this.state.height} 
          onContentHeightChange={this._onContentHeightChange}
          scrollTop={this.state.top}
          scrollLeft={this.state.left}
          overflowX={controlledScrolling ? "hidden" : "auto"}
          overflowY={controlledScrolling ? "hidden" : "auto"}

          footerDataGetter={this._footerDataGetter}
          rowHeight={50}
          rowGetter={this._rowGetter}
          rowsCount={this.props.store.rowCount}
          headerHeight={50}
          onScrollStart={this._onScrollStart}
          onScrollEnd={this._onScrollEnd}
          isColumnResizing={this.isColumnResizing}
          onColumnResizeEndCallback={this._onColumnResizeEndCallback}>
          {children}
        </Table>
      </TouchScrollArea>
      /*<Table
        ref="table"
        rowHeight={50}
        rowGetter={this._rowGetter}
        rowsCount={this.props.store.rowCount}
        headerHeight={50}
        onScrollStart={this._onScrollStart}
        onScrollEnd={this._onScrollEnd}
        maxHeight={600}
        width={1000}>
        {this.props.children}
      </Table>*/
    );
  }
});