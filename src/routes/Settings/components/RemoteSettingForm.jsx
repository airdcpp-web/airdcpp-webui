import React from 'react';
import SettingConstants from 'constants/SettingConstants';

import DataProviderDecorator from 'decorators/DataProviderDecorator';
import SocketService from 'services/SocketService';

import Form from 'components/form/Form';


const RemoteSettingForm = React.createClass({
	propTypes: {
		/**
		 * Form items to list
		 */
		keys: React.PropTypes.array.isRequired,

		formRef: React.PropTypes.func, // REQUIRED
	},

	onSave(changedValues) {
		return SocketService.post(SettingConstants.ITEMS_SET_URL, changedValues).then(this.props.refetchData);
	},

	save() {
		return this.refs.form.save();
	},

	render: function () {
		const { formRef, settings, fieldDefinitions, ...otherProps } = this.props;
		return (
			<div className="remote setting-form">
				<Form
					{ ...otherProps }
					ref={ formRef }
					onSave={ this.onSave }
					fieldDefinitions={ fieldDefinitions }
					value={ settings }
				/>
			</div>
		);
	}
});

export default DataProviderDecorator(RemoteSettingForm, {
	urls: {
		fieldDefinitions: ({ extension, keys }) => SocketService.post(SettingConstants.ITEMS_DEFINITIONS_URL, { keys }),
		settings: ({ extension, keys }) => SocketService.post(SettingConstants.ITEMS_GET_URL, { keys }),
	},
	dataConverters: {
		// Sort the data as the property order is random in the received JSON data
		fieldDefinitions: (data, { keys }) => keys.reduce((reduced, key) => {
			reduced[key] = data[key];
			return reduced;
		}, {}),
	},
});