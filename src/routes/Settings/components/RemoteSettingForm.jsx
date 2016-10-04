import React from 'react';
import SettingConstants from 'constants/SettingConstants';

import SocketService from 'services/SocketService';

import SettingForm from './SettingForm';


const RemoteSettingForm = React.createClass({
	propTypes: {
		/**
		 * Form items to list
		 */
		formItems: React.PropTypes.object.isRequired,
	},

	onFetchSettings() {
		return SocketService.post(SettingConstants.ITEMS_INFO_URL, { 
			keys: Object.keys(this.props.formItems)
		});
	},

	onSave(changedSettingArray) {
		return SocketService.post(SettingConstants.ITEMS_SET_URL, changedSettingArray);
	},

	save() {
		return this.refs.form.save();
	},

	render: function () {
		return (
			<div className="remote setting-form">
				<SettingForm
					{ ...this.props }
					ref="form"
					onFetchSettings={ this.onFetchSettings }
					onSave={ this.onSave }
				/>
			</div>
		);
	}
});

export default RemoteSettingForm;