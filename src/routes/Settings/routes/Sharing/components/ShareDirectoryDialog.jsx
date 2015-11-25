import React from 'react';
import Modal from 'components/semantic/Modal';

import { SHARE_ROOT_URL } from 'constants/ShareConstants';

import SocketService from 'services/SocketService';
import { RouteContext } from 'react-router';
import HistoryContext from 'mixins/HistoryContext';
import ShareProfileDecorator from 'decorators/ShareProfileDecorator';
import BrowseField from 'components/filebrowser/BrowseField';

import t from 'utils/tcomb-form';

import Form from 'components/Form';
import FormUtils from 'utils/FormUtils';
import FileUtils from 'utils/FileUtils';
import SelectField from 'components/SelectField';

const Entry = {
	path: t.Str,
	virtual_name: t.Str,
	profiles: t.list(t.Num),
	incoming: t.Bool,
};

const ShareDirectoryDialog = React.createClass({
	mixins: [ RouteContext, HistoryContext ],

	getInitialState() {
		this._isNew = !this.props.rootEntry;

		return {
			sourceData: FormUtils.valueMapToInfo(this.props.rootEntry, Object.keys(Entry)),
		};
	},

	onFieldChanged(id, value, hasChanges) {
		if (id.indexOf('path') != -1) {
			if (!value.virtual_name) {
				const sourceData = FormUtils.valueMapToInfo({ virtual_name: FileUtils.getLastDirectory(value.path, FileUtils) });
				return Promise.resolve(sourceData);
			}
		}
	},

	save() {
		return this.refs.form.save();
	},

	onSave(changedFields) {
		if (this._isNew) {
			return SocketService.post(SHARE_ROOT_URL, changedFields);
		}

		return SocketService.patch(SHARE_ROOT_URL, Object.assign(changedFields, { path: this.props.rootEntry.path }));
	},

	getFieldProfiles() {
		return this.props.profiles
			.reduce(FormUtils.convertRawProfile, []);
	},

	onFieldSetting(id, fieldOptions, formValue) {
		if (id === 'profiles') {
			Object.assign(fieldOptions, {
				factory: t.form.Select,
				template: SelectField,
				options: this.getFieldProfiles(),
				//transformer: FormUtils.intTransformer,
			});
		} else if (id === 'path') {
			if (this._isNew) {
				fieldOptions['factory'] = t.form.Textbox;
				fieldOptions['template'] = BrowseField;
			} else {
				fieldOptions['disabled'] = true;
			}
		}
	},

	render: function () {
		const title = this._isNew ? 'Add share directory' : 'Edit share directory';
		return (
			<Modal className="share-directory" title={title} onApprove={this.save} closable={false} icon="yellow folder" {...this.props}>
				<Form
					ref="form"
					formItems={Entry}
					onFieldChanged={this.onFieldChanged}
					onFieldSetting={this.onFieldSetting}
					onSave={this.onSave}
					sourceData={this.state.sourceData}
					context={{ location: this.props.location }}
				/>
			</Modal>
		);
	}
});

export default ShareProfileDecorator(ShareDirectoryDialog, true);