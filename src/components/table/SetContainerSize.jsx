

//var detectResize   = require('./detect-element-resize.js');
import _ from 'lodash';

var SetContainerSize = {
	getInitialState: function(){
		return {
			width: 0,
			height: 0
		};
	},

	componentDidMount : function(){
	    var win = window;
	    if (win.addEventListener) {
	      win.addEventListener('resize', _.throttle(this._update, 250), false);
	    } else if (win.attachEvent) {
	      win.attachEvent('onresize', _.throttle(this._update, 250));
	    } else {
	      win.onresize = this._update;
	    }
	    this._update();
	},

	componentWillReceiveProps(props) {
		this._update();
	},

	componentWillUnmount() {
		var win = window;
		if(win.removeEventListener) {
		  win.removeEventListener('resize', _.throttle(this._update, 250), false);
		} else if(win.removeEvent) {
		  win.removeEvent('onresize', _.throttle(this._update, 250), false);
		} else {
		  win.onresize = null;
		}
	},

	_update() {
		if (this.isMounted()) {
		  var node = this.getDOMNode();

		var borderWidth = node.offsetWidth - node.clientWidth;
		var borderHeight = node.offsetHeight - node.clientHeight;

		var width = node.parentNode.offsetWidth - borderWidth;
		var height = node.parentNode.offsetHeight - borderHeight;

		  this.setState({
		    width  : width,
		    height : height
		  });
		}

		setTimeout(this._update, 250);
	},
};

module.exports = SetContainerSize;

