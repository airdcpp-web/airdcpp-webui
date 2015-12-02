'use strict';

import React from 'react';

import OverlayDecorator from 'decorators/OverlayDecorator';
import Loader from 'components/semantic/Loader';

import '../style.css';

const Sidebar = React.createClass({
	componentDidMount() {
		this.props.showOverlay({
			context: '#main-layout',
			onShow: this.onShow,
		});
	},

	getInitialState() {
		return {
			visible: false,
		};
	},

	onShow() {
		this.setState({ visible: true });
	},

	render() {
		return (
			<div id="sidebar" className="ui right vertical overlay sidebar">
				<div id="sidebar-container">
					{ this.state.visible ? this.props.children : <Loader text=""/> }
				</div>
			</div>
		);
	},
});

export default OverlayDecorator(Sidebar, 'sidebar');
