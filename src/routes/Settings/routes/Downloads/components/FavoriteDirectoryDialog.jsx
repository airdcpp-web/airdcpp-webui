import React from 'react';
import Modal from 'components/semantic/Modal';
import DataProviderDecorator from 'decorators/DataProviderDecorator';

import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';
import IconConstants from 'constants/IconConstants';

import SocketService from 'services/SocketService';
import { RouteContext } from 'mixins/RouterMixin';

import t from 'utils/tcomb-form';

import FormUtils from 'utils/FormUtils';
import FileUtils from 'utils/FileUtils';

import Form from 'components/form/Form';
import BrowseField from 'components/form/BrowseField';
import FilesystemConstants from 'constants/FilesystemConstants';
import AutoSuggestField from 'components/form/AutoSuggestField';


const Entry = {
	path: t.Str,
	name: t.Str,
};

const FavoriteDirectoryDialog = React.createClass({
	mixins: [ RouteContext ],

	getInitialState() {
		this._isNew = !this.props.directoryEntry;

		const sourceData = FormUtils.valueMapToInfo(this.props.directoryEntry, Object.keys(Entry));
		return {
			sourceData,
		};
	},

	onFieldChanged(id, value, hasChanges) {
		if (id.indexOf('path') != -1) {
			const sourceData = FormUtils.valueMapToInfo({ 
				name: FileUtils.getLastDirectory(value.path, FileUtils) 
			});
			
			return Promise.resolve(sourceData);
		}

		return null;
	},

	save() {
		return this.refs.form.save();
	},

	onSave(changedFields) {
		if (this._isNew) {
			return SocketService.post(FavoriteDirectoryConstants.DIRECTORY_POST_URL, changedFields);
		}

		return SocketService.post(FavoriteDirectoryConstants.DIRECTORY_UPDATE_URL, {
			path: this.props.directoryEntry.path,
			...changedFields,
		});
	},

	onFieldSetting(id, fieldOptions, formValue) {
		if (id === 'path') {
			if (this._isNew) {
				fieldOptions['factory'] = t.form.Textbox;
				fieldOptions['template'] = BrowseField;
			} else {
				fieldOptions['disabled'] = true;
			}
			
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
		const title = this._isNew ? 'Add favorite directory' : 'Edit favorite directory';

		const context = {
			location: this.props.location,
		};

		return (
			<Modal 
				className="favorite-directory" 
				title={title} 
				onApprove={this.save} 
				closable={false} 
				icon={ IconConstants.FOLDER } 
				{...this.props}
			>
				<Form
					ref="form"
					formItems={Entry}
					onFieldChanged={this.onFieldChanged}
					onFieldSetting={this.onFieldSetting}
					onSave={this.onSave}
					sourceData={this.state.sourceData}
					context={ context }
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