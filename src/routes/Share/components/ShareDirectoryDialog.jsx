import React from 'react';
import Modal from 'components/semantic/Modal';

import ShareConstants from 'constants/ShareConstants';
import ShareRootConstants from 'constants/ShareRootConstants';
import IconConstants from 'constants/IconConstants';

import DataProviderDecorator from 'decorators/DataProviderDecorator';
import ShareProfileDecorator from 'decorators/ShareProfileDecorator';
import SocketService from 'services/SocketService';
import { RouteContext } from 'mixins/RouterMixin';

import Message from 'components/semantic/Message';

import t from 'utils/tcomb-form';

import FormUtils from 'utils/FormUtils';
import FileUtils from 'utils/FileUtils';

import Form from 'components/form/Form';
import FilesystemConstants from 'constants/FilesystemConstants';
import SelectField from 'components/form/SelectField';
import AutoSuggestField from 'components/form/AutoSuggestField';

import '../style.css';

import { FieldTypes } from 'constants/SettingConstants';

const Entry = {
	path: {
		type: FieldTypes.DIRECTORY_PATH,
	},
	virtual_name:{
		type: FieldTypes.STRING,
		help: 'Directories with identical virtual names will be merged in filelist',
	},
	profiles: {
		type: FieldTypes.LIST_NUMBER,
		title: 'Share profiles',
		help: 'New share profiles can be created from application settings',
	}, 
	incoming: {
		type: FieldTypes.BOOLEAN,
	},
};

const ShareDirectoryDialog = React.createClass({
	mixins: [ RouteContext ],
	isNew() {
		return !this.props.rootEntry;
	},

	onFieldChanged(id, value, hasChanges) {
		if (id.indexOf('path') != -1) {
			const mergeFields = { 
				virtual_name: FileUtils.getLastDirectory(value.path, FileUtils) 
			};
			
			return Promise.resolve(mergeFields);
		}

		return null;
	},

	save() {
		return this.refs.form.save();
	},

	onSave(changedFields) {
		if (this.isNew()) {
			return SocketService.post(ShareRootConstants.ROOTS_URL, changedFields);
		}

		return SocketService.patch(ShareRootConstants.ROOTS_URL + '/' + this.props.rootEntry.id, changedFields);
	},

	getFieldProfiles() {
		return this.props.profiles
			.map(FormUtils.normalizeEnumValue);
	},

	onFieldSetting(id, fieldOptions, formValue) {
		if (id === 'profiles') {
			Object.assign(fieldOptions, {
				factory: t.form.Select,
				template: SelectField,
				options: this.getFieldProfiles(),
			});
		} else if (id === 'path') {
			fieldOptions['disabled'] = !this.isNew();
			fieldOptions['config'] = Object.assign({} || fieldOptions['config'], {
				historyId: FilesystemConstants.LOCATION_DOWNLOAD,
			});
		} else if (id === 'virtual_name') {
			fieldOptions['factory'] = t.form.Textbox;
			fieldOptions['template'] = AutoSuggestField;
			fieldOptions['config'] = {
				suggestionGetter: () => this.props.virtualNames,
			};

		}
	},

	render: function () {
		const title = this.isNew() ? 'Add share directory' : 'Edit share directory';
		const { rootEntry, ...other } = this.props;
		return (
			<Modal 
				className="share-directory" 
				title={ title } 
				onApprove={ this.save } 
				closable={ false } 
				icon={ IconConstants.FOLDER } 
				{ ...other }
			>
				<Message 
					title="Hashing information"
					icon={ IconConstants.INFO }
					description={ 
						<span>
							<p>
								New files will appear in share only after they have finished hashing (the client has calculated checksums for them). Information about hashing progress will be posted to the event log.
							</p>
						</span>
					}
				/>
				<Form
					ref="form"
					fieldDefinitions={ Entry }
					onFieldChanged={ this.onFieldChanged }
					onFieldSetting={ this.onFieldSetting }
					onSave={ this.onSave }
					value={ rootEntry }
					defaultValue={ {
						// Add the default profile for new entries
						profiles: [ this.props.profiles.find(profile => profile.default).id ],
					} }
					context={ {
						location: this.props.location,
					} }
				/>
			</Modal>
		);
	}
});

export default DataProviderDecorator(ShareProfileDecorator(ShareDirectoryDialog, false), {
	urls: {
		virtualNames: ShareConstants.GROUPED_ROOTS_GET_URL,
	},
	dataConverters: {
		virtualNames: data => data.map(item => item.name, []),
	},
});