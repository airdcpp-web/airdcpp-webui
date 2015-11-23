import React from 'react';
import Modal from 'components/semantic/Modal';

import { SHARE_PROFILES_URL, HIDDEN_PROFILE_ID } from 'constants/ShareConstants';
import { FAVORITE_HUB_URL } from 'constants/FavoriteHubConstants';

import SocketService from 'services/SocketService';
import { RouteContext } from 'react-router';
import HistoryContext from 'mixins/HistoryContext';

import t from 'utils/tcomb-form';

import Form from 'components/Form';
import FormUtils from 'utils/FormUtils';

const Entry = {
	name: t.Str,
	hub_url: t.Str,
	hub_description: t.maybe(t.Str),
	share_profile: t.maybe(t.Number),
	//share_profile: t.Any,
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
			sourceData: null,
		};
	},

	onProfilesReceived(data) {
		this.profiles = data;

		// Set source data so that the form will render
		const sourceData = FormUtils.valueMapToInfo(this.props.hubEntry, Object.keys(Entry));
		this.setState({ sourceData: sourceData });
	},

	componentDidMount() {
		SocketService.get(SHARE_PROFILES_URL)
			.then(this.onProfilesReceived)
			.catch(error => 
				console.error('Failed to load profiles: ' + error)
			);
	},

	checkAdcHub(hubUrl) {
		this.isAdcHub = hubUrl.indexOf('adc://') === 0 || hubUrl.indexOf('adcs://') === 0;
	},

	onFieldChanged(id, value, hasChanges) {
		if (id.indexOf('hub_url') != -1) {
			this.checkAdcHub(value.hub_url);

			if (!this.isAdcHub && value.share_profile !== HIDDEN_PROFILE_ID) {
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
			return SocketService.post(FAVORITE_HUB_URL, changedFields);
		}

		return SocketService.patch(FAVORITE_HUB_URL + '/' + this.props.hubEntry.id, changedFields);
	},

	convertProfile(profiles, rawItem) {
		profiles.push({
			value: rawItem.id,
			text: rawItem.name
		});

		return profiles;
	},

	getFieldProfiles() {
		return this.profiles
			.filter(p => this.isAdcHub || p.id === HIDDEN_PROFILE_ID)
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
			<Modal className="fav-hub" title={title} onApprove={this.save} closable={false} icon="yellow star" {...this.props}>
				<Form
					ref="form"
					title="User information"
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

export default FavoriteHubDialog;