import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { ChildFormMixin } from 'routes/Settings/mixins/SettingPageMixin';

import SocketService from 'services/SocketService';
import SettingConstants from 'constants/SettingConstants';


const AutoValuePanel = React.createClass({
	mixins: [ ChildFormMixin('form') ],
	propTypes: {
		/**
		 * Form items to list
		 */
		formItems: React.PropTypes.object.isRequired,

		/**
		 * Type of the value section (from the setting key)
		 */
		type: React.PropTypes.string.isRequired,
	},

	getAutoKey() {
		return this.props.type + '_auto_limits';
	},

	// Fetch auto settings when enabling auto detection
	onFieldChanged(changedKey, formValue, hasChanges) {
		const autoSettingKey = this.getAutoKey();
		if (changedKey !== autoSettingKey || !formValue[autoSettingKey]) {
			return null;
		}

		return SocketService.post(SettingConstants.ITEMS_INFO_URL, { 
			keys: Object.keys(this.props.formItems).filter(key => key !== autoSettingKey), 
			force_auto_values: true 
		});
	},

	// Disable other fields when auto detection is enabled
	onFieldSetting(settingKey, fieldOptions, formValue) {
		if (formValue[this.getAutoKey()] && settingKey !== this.getAutoKey()) {
			fieldOptions['disabled'] = true;
		}
	},

	render() {
		return (
			<div className="ui segment">
				<RemoteSettingForm
					ref="form"
					formItems={ this.props.formItems }
					onFieldChanged={ this.onFieldChanged }
					onFieldSetting={ this.onFieldSetting }
				/>
			</div>
		);
	}
});

export default AutoValuePanel;