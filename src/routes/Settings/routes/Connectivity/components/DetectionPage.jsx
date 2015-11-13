import React from 'react';

import SettingForm from 'routes/Settings/components/SettingForm';
import DetectPanel from './DetectPanel';

import t from 'utils/tcomb-form';

const Entry = {
	connection_auto_v4: t.maybe(t.Boolean),
	connection_auto_v6: t.maybe(t.Boolean),
};

const Detection = React.createClass({
	getInitialState() {
		return {
			enableDetection: false
		};
	},

	onCurrentSettings(value) {
		this.setState({
			enableDetection: value.connection_auto_v4 || value.connection_auto_v6
		});
	},

	render() {
		return (
			<div className="detection-settings">
				{ this.state.enableDetection ? <DetectPanel/> : null }
				<SettingForm
					formItems={Entry}
					onCurrentSettings={this.onCurrentSettings}
				/>
			</div>
		);
	}
});

export default Detection;