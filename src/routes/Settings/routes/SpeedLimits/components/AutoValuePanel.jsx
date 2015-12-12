import React from 'react';
import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import SocketService from 'services/SocketService';
import SettingConstants from 'constants/SettingConstants';


const AutoValuePanel = React.createClass({
	mixins: [ SettingPageMixin('form') ],

	// Fetch auto settings when enabling auto detection
	onFieldChanged(id, formValue, hasChanges) {
		const detectFieldId = Object.keys(this.props.formItems)[0];
		if (id[0] !== detectFieldId || !formValue[detectFieldId]) {
			return null;
		}

		return SocketService.post(SettingConstants.ITEMS_INFO_URL, { 
			keys: Object.keys(this.props.formItems).slice(1), 
			force_auto_values: true 
		});
	},

	// Disable other fields when auto detection is enabled
	onFieldSetting(id, fieldOptions, formValue) {
		const detectFieldId = Object.keys(this.props.formItems)[0];

		if (formValue[detectFieldId] && id !== detectFieldId) {
			fieldOptions['disabled'] = true;
		}
	},

	render() {
		return (
			<div className="detection-settings ui segment">
				<SettingForm
					ref="form"
					formItems={this.props.formItems}
					onFieldChanged={this.onFieldChanged}
					onFieldSetting={this.onFieldSetting}
				/>
			</div>
		);
	}
});

export default AutoValuePanel;