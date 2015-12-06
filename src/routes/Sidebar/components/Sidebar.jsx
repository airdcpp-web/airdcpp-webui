'use strict';

import React from 'react';

import OverlayDecorator from 'decorators/OverlayDecorator';
import Loader from 'components/semantic/Loader';
import BrowserUtils from 'utils/BrowserUtils';

import '../style.css';

const Sidebar = React.createClass({
	componentDidMount() {
		this.props.showOverlay({
			context: $(this.props.overlayContext),
			transition: 'overlay',
			mobileTransition: 'overlay',
			closable: !BrowserUtils.useMobileLayout(),
			// Using onShow callback would cause a significant delay, do this via timeout instead
			onVisible: () => setTimeout(this.onVisible, 300),
		});
	},

	getInitialState() {
		// Don't render the content while sidebar is animating
		// Avoids issues if there are router transitions while the sidebar is animating (such as placing the content in the middle of the window)
		return {
			visible: false,
		};
	},

	onVisible() {
		if (this.isMounted()) {
			this.setState({ visible: true });
		}
	},

	render() {
		return (
			<div id="sidebar" className="ui right vertical sidebar">
				<div id="sidebar-container">
					{ this.state.visible ? this.props.children : <Loader text=""/> }
				</div>
			</div>
		);
	},
});

export default OverlayDecorator(Sidebar, 'sidebar');
