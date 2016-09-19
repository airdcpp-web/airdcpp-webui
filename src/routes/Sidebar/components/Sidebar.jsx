import React from 'react';
import ReactDOM from 'react-dom';
import invariant from 'invariant';

import BrowserUtils from 'utils/BrowserUtils';
import Loader from 'components/semantic/Loader';
import OverlayDecorator from 'decorators/OverlayDecorator';
import Resizable from 'react-resizable-box';

import '../style.css';


const Sidebar = React.createClass({
	propTypes: {
		context: React.PropTypes.string,
	},

	componentDidMount() {
		const context = $(this.props.overlayContext);
		invariant(context.length !== 0, 'Invalid sidebar context');

		this.props.showOverlay({
			context: context,
			transition: 'overlay',
			mobileTransition: 'overlay',
			closable: !BrowserUtils.useMobileLayout(),
			// Using onShow callback would cause a significant delay, do this via timeout instead
			onVisible: () => setTimeout(this.onVisible, 350),
		});
	},

	getInitialState() {
		this.initialWidth = BrowserUtils.loadLocalProperty('sidebar_width', 1000);
		return {
			// Don't render the content while sidebar is animating
			// Avoids issues if there are router transitions while the sidebar is animating (such as placing the content in the middle of the window)
			visible: false,
		};
	},

	onVisible() {
		if (this.isMounted()) {
			this.setState({ visible: true });
		}
	},

	onResizeStop(direction, styleSize, { width }) {
		BrowserUtils.saveLocalProperty('sidebar_width', width);
	},

	render() {
		// Ref hack because of https://github.com/bokuweb/react-resizable-box/issues/45
		return (
			<Resizable
				ref={ c => {
					if (c) {
						ReactDOM.findDOMNode(c).setAttribute('id', 'sidebar');
					}
				} }
				width={ Math.min(this.initialWidth, window.innerWidth) }
				height={ window.innerHeight }
				minWidth={ 500 }
				maxWidth={ window.innerWidth }
				customClass="ui right vertical sidebar" 

				isResizable={
					{ top:false, right:false, bottom:false, left:true, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }
				}
				onResizeStop={ this.onResizeStop }
			>
				<div id="sidebar-container">
					{ this.state.visible ? this.props.children : <Loader text=""/> }
				</div>
			</Resizable>
		);
	},
});

export default OverlayDecorator(Sidebar, 'sidebar');
