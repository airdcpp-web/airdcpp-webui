import React from 'react';
import Modal from 'components/semantic/Modal';
import Promise from 'utils/Promise';

import ShareProfileConstants from 'constants/ShareProfileConstants';
import FavoriteHubConstants from 'constants/FavoriteHubConstants';

import SocketService from 'services/SocketService';
import { RouteContext } from 'react-router';
import HistoryContext from 'mixins/HistoryContext';

import ShareProfileDecorator from 'decorators/ShareProfileDecorator';
import IconConstants from 'constants/IconConstants';

import t from 'utils/tcomb-form';

import Form from 'components/form/Form';
import FormUtils from 'utils/FormUtils';

const Entry = {
	name: t.Str,
	hub_url: t.Str,
	hub_description: t.maybe(t.Str),
	share_profile: t.maybe(t.Number),
	auto_connect: t.Bool,
	nick: t.maybe(t.Str),
	user_description: t.maybe(t.Str),
};

const FavoriteHubDialog = React.createClass({
	mixins: [ RouteContext, HistoryContext ],

	getInitialState() {
		this._isNew = !this.props.hubEntry;
		if (!this._isNew) {
			this.checkAdcHub(this.props.hubEntry.hub_url);
		}

		return {
			sourceData: FormUtils.valueMapToInfo(this.props.hubEntry, Object.keys(Entry)),
		};
	},

	checkAdcHub(hubUrl) {
		this.isAdcHub = hubUrl.indexOf('adc://') === 0 || hubUrl.indexOf('adcs://') === 0;
	},

	onFieldChanged(id, value, hasChanges) {
		if (id.indexOf('hub_url') != -1) {
			this.checkAdcHub(value.hub_url);

			if (!this.isAdcHub && value.share_profile !== ShareProfileConstants.HIDDEN_PROFILE_ID) {
				// Reset share profile
				const sourceData = FormUtils.valueMapToInfo({ share_profile: null });
				return Promise.resolve(sourceData);
			}
		}
	},

	save() {
		return this.refs.form.save();
	},

	onSave(changedFields) {
		if (this._isNew) {
			return SocketService.post(FavoriteHubConstants.HUB_URL, changedFields);
		}

		return SocketService.patch(FavoriteHubConstants.HUB_URL + '/' + this.props.hubEntry.id, changedFields);
	},

	convertProfile(profiles, rawItem) {
		profiles.push({
			value: rawItem.id,
			text: rawItem.name
		});

		return profiles;
	},

	getFieldProfiles() {
		return this.props.profiles
			.filter(p => this.isAdcHub || p.id === ShareProfileConstants.HIDDEN_PROFILE_ID)
			.reduce(this.convertProfile, []);
	},

	onFieldSetting(id, fieldOptions, formValue) {
		if (id === 'share_profile') {
			Object.assign(fieldOptions, {
				help: 'Custom share profiles can be selected only after entering an ADC hub address (starting with adc:// or adcs://)',
				nullOption: { value: 'null', text: 'Global default' },
				factory: t.form.Select,
				options: this.getFieldProfiles(),
				transformer: FormUtils.intTransformer,
			});
		}
	},

	render: function () {
		const title = this._isNew ? 'Add favorite hub' : 'Edit favorite hub';
		return (
			<Modal className="fav-hub" title={title} onApprove={this.save} closable={false} icon={ IconConstants.FAVORITE } {...this.props}>
				<Form
					ref="form"
					title="User information"
					formItems={Entry}
					onFieldChanged={this.onFieldChanged}
					onFieldSetting={this.onFieldSetting}
					onSave={this.onSave}
					sourceData={this.state.sourceData}
				/>
			</Modal>
		);
	}
});

export default ShareProfileDecorator(FavoriteHubDialog, true);