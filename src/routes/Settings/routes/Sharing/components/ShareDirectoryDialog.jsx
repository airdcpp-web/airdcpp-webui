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

const Entry = {
	virtual_name: t.Str,
	path: t.Str,
	profiles: t.list(t.Num),
	incoming: t.Bool,
};

const ShareDirectoryDialog = React.createClass({
	mixins: [ RouteContext, HistoryContext ],

	getInitialState() {
		this._isNew = !this.props.rootEntry;
		/*if (!this._isNew) {
			this.checkAdcHub(this.props.hubEntry.hub_url);
		}*/

		return {
			sourceData: FormUtils.valueMapToInfo(this.props.rootEntry, Object.keys(Entry)),
		};
	},

	onFieldChanged(id, value, hasChanges) {
		/*if (id.indexOf('hub_url') != -1) {
			this.checkAdcHub(value.hub_url);

			if (!this.isAdcHub && value.share_profile !== HIDDEN_PROFILE_ID) {
				// Reset share profile
				const sourceData = FormUtils.valueMapToInfo({ share_profile: null });
				return Promise.resolve(sourceData);
			}
		}*/
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
				//help: 'Custom share profiles can be selected only after entering an ADC hub address (starting with adc:// or adcs://)',
				//nullOption: { value: 'null', text: 'Global default' },
				factory: t.form.Select,
				options: this.getFieldProfiles(),
				transformer: FormUtils.intTransformer,
			});
		} else if (id === 'path') {
			if (this._isNew) {
				fieldOptions['factory'] = BrowseField;
				fieldOptions['location'] = this.props.location;
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
					//title="User information"
					formItems={Entry}
					onFieldChanged={this.onFieldChanged}
					onFieldSetting={this.onFieldSetting}
					onSave={this.onSave}
					sourceData={this.state.sourceData}
					location={this.props.location}
				/>
			</Modal>
		);
	}
});

export default ShareProfileDecorator(ShareDirectoryDialog, true);