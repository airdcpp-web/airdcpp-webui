var React = require('react');

var ZyngaScroller = require('./ZyngaScroller.jsx');
var TouchableArea = require('./TouchableArea.jsx');

var PropTypes = React.PropTypes;

var cloneWithProps = require('react/lib/cloneWithProps');

function isTouchDevice() {
  //return 'ontouchstart' in document.documentElement // works on most browsers
   //   || 'onmsgesturechange' in window; // works on ie10
   return false;
};

var ScrollArea = React.createClass({

  componentWillMount : function() {
    this.scroller = new ZyngaScroller(isTouchDevice() ? this._handleScroll : this._doNothing);
    this._scrollTimer = null;
  },

  render : function() {
    if (!isTouchDevice()) {
      return this.props.children;
    }

    return (
      <TouchableArea scroller={this.scroller}>
        {this.props.children}
      </TouchableArea>
    );
  },

  _onContentDimensionsChange : function(tableWidth, tableHeight, contentWidth, contentHeight) {
    this.scroller.setDimensions(
      tableWidth,
      tableHeight,
      contentWidth,
      contentHeight
    );
  },

  _handleScroll : function(left, top) {
    if (this.props.onScrollStart && this._scrollTimer === null) {
      console.log("Touch scroll start, top: " + top);
      this.props.onScrollStart(left, top);
    }

    if (this.props.onScrollEnd) {
      if (this._scrollTimer !== null) {
        clearTimeout(this._scrollTimer);
      }

      var self = this;
      this._scrollTimer = setTimeout(() => {
        console.log("Touch scroll end, top: " + top);
        self.props.onScrollEnd(left, top);
        this._scrollTimer = null;
      }, 200);
    }

    this.props.handleScroll(left, top);
  },

  _doNothing : function(left, top) {
    
  }
});

module.exports = ScrollArea;
