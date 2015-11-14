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

	onSourceDataChanged(sourceData) {
		this.setState({
			detectV4: sourceData.connection_auto_v4.value,
			detectV6: sourceData.connection_auto_v6.value
		});
	},

	render() {
		return (
			<div className="detection-settings">
				<SettingForm
					ref="form"
					formItems={Entry}
					onSourceDataChanged={this.onSourceDataChanged}
				/>
				<DetectPanel detectV4={this.state.detectV4} detectV6={this.state.detectV6}/>
			</div>
		);
	}
});

export default DetectionPage;