import React from 'react';
import invariant from 'invariant';

import BrowserUtils from 'utils/BrowserUtils';
import Loader from 'components/semantic/Loader';
import OverlayDecorator from 'decorators/OverlayDecorator';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Resizable from 'react-resizable-box';
import SetContainerSize from 'mixins/SetContainerSize';

import '../style.css';


const Sidebar = React.createClass({
	mixins: [ PureRenderMixin, SetContainerSize ],
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

	onResizeStop(direction, styleSize, element, delta) {
		if (!delta.width) {
			return;
		}

		const width = this.state.width + delta.width;
		BrowserUtils.saveLocalProperty('sidebar_width', width);
		this.setState({ width });
	},

	render() {
		return (
			<Resizable
				width={ Math.min(this.initialWidth, window.innerWidth) }
				height={ window.innerHeight }
				minWidth={ 500 }
				maxWidth={ window.innerWidth } 

				extendsProps={{
					id: 'sidebar',
					className: 'ui right vertical sidebar',
				}}

				enable={
					{ top:false, right:false, bottom:false, left: !BrowserUtils.useMobileLayout(), topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }
				}
				onResizeStop={ this.onResizeStop }
			>
				<div id="sidebar-container">
					{ !this.state.visible ? <Loader text=""/> : React.cloneElement(this.props.children, {
						width: this.state.width,
					}) }
				</div>
			</Resizable>
		);
	},
});

export default OverlayDecorator(Sidebar, 'sidebar');
