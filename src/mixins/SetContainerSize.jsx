import _ from 'lodash';
import ReactDOM from 'react-dom';


const SetContainerSize = {
	getInitialState: function () {
		return {
			width: 0,
			height: 0,
			windowWidth: 0,
			windowHeight: 0
		};
	},

	componentDidMount : function () {
		const win = window;
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
		const win = window;
		if (win.removeEventListener) {
			win.removeEventListener('resize', _.throttle(this._update, 250), false);
		} else if (win.removeEvent) {
			win.removeEvent('onresize', _.throttle(this._update, 250), false);
		} else {
			win.onresize = null;
		}
	},

	_update() {
		if (this.isMounted()) {
			const node = ReactDOM.findDOMNode(this);

			const borderWidth = node.offsetWidth - node.clientWidth;
			const borderHeight = node.offsetHeight - node.clientHeight;

			const width = node.parentNode.offsetWidth - borderWidth;
			const height = node.parentNode.offsetHeight - borderHeight;

			this.setState({
				width	: width,
				height : height,
				windowWidth: window.innerWidth,
				windowHeight: window.innerHeight
			});
		}
	},
};

export default SetContainerSize;

