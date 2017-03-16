import React from 'react';
import Modal from 'components/semantic/Modal';

import DataProviderDecorator from 'decorators/DataProviderDecorator';
import SocketService from 'services/SocketService';
import { RouteContext } from 'mixins/RouterMixin';

import ExtensionConstants from 'constants/ExtensionConstants';
import IconConstants from 'constants/IconConstants';

import FormUtils from 'utils/FormUtils';
import SettingForm from 'routes/Settings/components/SettingForm';


const getSettingsUrl = (extensionId) => {
	return ExtensionConstants.EXTENSIONS_URL + '/' + extensionId + '/settings';
};

const fetchSettings = (extensionId) => {
	return SocketService.get(getSettingsUrl(extensionId) + '/infos');
};

const ExtensionsConfigureDialog = React.createClass({
	mixins: [ RouteContext ],

	save() {
		return this.refs.form.save();
	},

	onSave(changedFields) {
		return SocketService.patch(getSettingsUrl(this.props.extension.id), changedFields);
	},

	onFetchSettings() {
		return fetchSettings(this.props.extension.id);
	},

	render: function () {
		const { extension } = this.props;
		return (
			<Modal 
				{ ...this.props }
				className="extensions configure" 
				title={ extension.name } 
				onApprove={ this.save } 
				closable={ false } 
				icon={ IconConstants.EDIT }
			>
				<SettingForm
					{ ...this.props }
					ref="form"
					onFetchSettings={ this.onFetchSettings }
					onSave={ this.onSave }
				/>
			</Modal>
		);
	}
});

export default DataProviderDecorator(ExtensionsConfigureDialog, {
	urls: {
		formItems: ({ extension }) => fetchSettings(extension.id),
	},
	dataConverters: {
		formItems: FormUtils.parseFields,
	},
});