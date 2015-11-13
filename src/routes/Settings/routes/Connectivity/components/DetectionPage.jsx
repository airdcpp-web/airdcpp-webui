import React from 'react';

import SettingForm from 'routes/Settings/components/SettingForm';
import DetectPanel from './DetectPanel';

import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	connection_auto_v4: t.maybe(t.Boolean),
	connection_auto_v6: t.maybe(t.Boolean),
};

const DetectionPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],
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
				<SettingForm
					ref="form"
					formItems={Entry}
					onCurrentSettings={this.onCurrentSettings}
				/>
				{ this.state.enableDetection ? <DetectPanel/> : null }
			</div>
		);
	}
});

export default DetectionPage;