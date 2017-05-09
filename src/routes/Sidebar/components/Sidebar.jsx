import PropTypes from 'prop-types';
import React from 'react';
import invariant from 'invariant';

import BrowserUtils from 'utils/BrowserUtils';
import Loader from 'components/semantic/Loader';
import OverlayDecorator from 'decorators/OverlayDecorator';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Resizable from 'react-resizable-box';

import '../style.css';


const Sidebar = React.createClass({
	mixins: [ PureRenderMixin ],
	propTypes: {
		context: PropTypes.string,
	},

	componentDidMount() {
		const context = $(this.props.overlayContext);
		invariant(context.length !== 0, 'Invalid sidebar context');

		this.props.showOverlay(this.c.resizable, {
			context: context,
			transition: 'overlay',
			mobileTransition: 'overlay',
			closable: !BrowserUtils.useMobileLayout(),
			onShow: this.onVisible,
		});
	},

	getInitialState() {
		const width = BrowserUtils.loadLocalProperty('sidebar_width', 1000);
		return {
			// Don't render the content while sidebar is animating
			// Avoids issues if there are router transitions while the sidebar is 
			// animating (e.g. the content is placed in the middle of the window)
			animating: true,
			width: Math.max(500, width),
		};
	},

	onVisible() {
		this.setState({ animating: false });
	},

	onResizeStop(event, direction, element, delta) {
		if (!delta.width) {
			return;
		}

		const width = element.clientWidth;
		BrowserUtils.saveLocalProperty('sidebar_width', width);
		this.setState({ width });
	},

	render() {
		const { width, animating } = this.state;
		return (
			<Resizable
				ref={ c => this.c = c }
				width={ Math.min(width, window.innerWidth) }
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
					{ animating ? <Loader text=""/> : React.cloneElement(this.props.children, {
						width,
					}) }
				</div>
			</Resizable>
		);
	},
});

export default OverlayDecorator(Sidebar, 'sidebar');
