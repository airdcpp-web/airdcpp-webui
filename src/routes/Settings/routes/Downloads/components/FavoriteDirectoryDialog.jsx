import React from 'react';
import Modal from 'components/semantic/Modal';
import DataProviderDecorator from 'decorators/DataProviderDecorator';

import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';
import IconConstants from 'constants/IconConstants';

import SocketService from 'services/SocketService';
import { RouteContext } from 'mixins/RouterMixin';

import t from 'utils/tcomb-form';
import { FieldTypes } from 'constants/SettingConstants';

import FileUtils from 'utils/FileUtils';

import Form from 'components/form/Form';
import FilesystemConstants from 'constants/FilesystemConstants';
import AutoSuggestField from 'components/form/AutoSuggestField';


const Entry = [
	{
		key: 'path',
		type: FieldTypes.DIRECTORY_PATH,
	},
	{
		key: 'name',
		type: FieldTypes.STRING,
	},
];

const FavoriteDirectoryDialog = React.createClass({
	mixins: [ RouteContext ],
	isNew() {
		return !this.props.directoryEntry;
	},

	onFieldChanged(id, value, hasChanges) {
		if (id.indexOf('path') != -1) {
			return Promise.resolve({
				name: FileUtils.getLastDirectory(value.path, FileUtils) 
			});
		}

		return null;
	},

	save() {
		return this.refs.form.save();
	},

	onSave(changedFields) {
		if (this.isNew()) {
			return SocketService.post(FavoriteDirectoryConstants.DIRECTORIES_URL, changedFields);
		}

		return SocketService.patch(FavoriteDirectoryConstants.DIRECTORIES_URL + '/' + this.props.directoryEntry.id, changedFields);
	},

	onFieldSetting(id, fieldOptions, formValue) {
		if (id === 'path') {
			fieldOptions['disabled'] = !this.isNew();
			fieldOptions['config'] = Object.assign(fieldOptions['config'] || {}, {
				historyId: FilesystemConstants.LOCATION_DOWNLOAD,
			});
		} else if (id === 'name') {
			fieldOptions['factory'] = t.form.Textbox;
			fieldOptions['template'] = AutoSuggestField;
			fieldOptions['config'] = {
				suggestionGetter: () => this.props.virtualNames,
			};
		}
	},

	render: function () {
		const title = this.isNew() ? 'Add favorite directory' : 'Edit favorite directory';
		return (
			<Modal 
				className="favorite-directory" 
				title={ title } 
				onApprove={ this.save } 
				closable={ false } 
				icon={ IconConstants.FOLDER } 
				{...this.props}
			>
				<Form
					ref="form"
					fieldDefinitions={Entry}
					onFieldChanged={ this.onFieldChanged }
					onFieldSetting={ this.onFieldSetting }
					onSave={ this.onSave }
					value={ this.props.directoryEntry }
					context={ {
						location: this.props.location,
					} }
				/>
			</Modal>
		);
	}
});

export default DataProviderDecorator(FavoriteDirectoryDialog, {
	urls: {
		virtualNames: FavoriteDirectoryConstants.GROUPED_DIRECTORIES_URL,
	},
	dataConverters: {
		virtualNames: data => data.map(item => item.name, []),
	},
});