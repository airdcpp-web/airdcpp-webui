

var detectResize   = require('./detect-element-resize.js');

var SetContainerSize = {
	getInitialState: function(){
		return {
			width: 0,
			height: 0
		};
	},

	componentDidMount : function(){
		this._resizeTimer = null;
		this._updateDimensions();
		detectResize.addResizeListener(this.getDOMNode().parentNode, this._onResize);
	},

	componentWillUnmount : function(){
		this._clearTimer();
		detectResize.removeResizeListener(this.getDOMNode().parentNode, this._onResize);
	},

	_updateDimensions() {
		var node = this.getDOMNode();

		var borderWidth = node.offsetWidth - node.clientWidth;
		var borderHeight = node.offsetHeight - node.clientHeight;

		var width = node.parentNode.offsetWidth - borderWidth;
		var height = node.parentNode.offsetHeight - borderHeight;

		this.setState({
			width:width,
			height:height
		});
	},

	_clearTimer() {
		if (this._resizeTimer !== null) {
			clearTimeout(this._resizeTimer);
		}
	},

	_onResize : function() {
		this._clearTimer();
		this._resizeTimer = setTimeout(this._updateDimensions, 50);
	}
};

module.exports = SetContainerSize;

