import React from 'react';
import Modal from 'components/semantic/Modal';
import { PROFILES_GET_URL, HIDDEN_PROFILE_ID } from 'constants/ShareConstants';
import { FAVORITE_HUB_URL } from 'constants/FavoriteHubConstants';
import SocketService from 'services/SocketService';
import { RouteContext } from 'react-router';
import HistoryContext from 'mixins/HistoryContext';

import t from 'utils/tcomb-form';

const Form = t.form.Form;
const Entry = t.struct({
	name: t.Str,
	hub_url: t.Str,
	hub_description: t.maybe(t.Str),
	share_profile: t.Num,
	auto_connect: t.Bool,
	nick: t.maybe(t.Str),
	user_description: t.maybe(t.Str),
});

export default React.createClass({
	mixins: [ RouteContext, HistoryContext ],

	getInitialState() {
		let value = null;
		this._isNew = !this.props.hubEntry;
		if (!this._isNew) {
			value = _.clone(this.props.hubEntry, true);
			value['share_profile'] = value.share_profile.id;

			this.checkAdcHub(value.hub_url);
		}

		return {
			error: null,
			value: value,
			profiles: []
		};
	},

	addProfile(profiles, rawItem) {
		if (rawItem.default) {
			this.defaultId = rawItem.id;
		}

		profiles.push({
			value: rawItem.id,
			text: rawItem.str
		});
		return profiles;
	},

	onProfilesReceived(data) {
		data.reduce(this.addProfile, this.allProfiles);
		this._setProfiles();
		if (this._isNew) {
			// We don't have anything selected yet

			const value = Object.assign({}, this.state.value, { 
				'share_profile': this.defaultId
			});

			this.setState({ value: value });
		}
	},

	componentDidMount() {
		this.allProfiles = [];
		SocketService.get(PROFILES_GET_URL)
			.then(this.onProfilesReceived)
			.catch(error => 
				console.error('Failed to load profiles: ' + error)
			);
	},

	_setProfiles() {
		this.setState({ 
			profiles: this.allProfiles.filter(p => this.isAdcHub || (p.value === this.defaultId || p.value === HIDDEN_PROFILE_ID), []) 
		});
	},

	checkAdcHub(hubUrl) {
		this.isAdcHub = hubUrl.indexOf('adc://') == 0 || hubUrl.indexOf('adcs://') == 0;
	},

	onChange(value, path) {
		if (path.indexOf('hub_url') > -1) {
			this.checkAdcHub(value.hub_url);
			if (!this.isAdcHub) {
				value.share_profile = this.defaultId;
			}

			this._setProfiles();
		}

		this.refs.form.getComponent(path).validate();
		this.setState({ value: value });
	},

	_handleError(error) {
		if (error.code === 422) {
			this.setState({ error: error.json });
		} else {
			// ?
		}
	},

	save() {
		let value = this.refs.form.getValue();
		if (value) {
			let promise;
			if (this._isNew) {
				promise = SocketService.post(FAVORITE_HUB_URL, value);
			} else {
				promise = SocketService.patch(FAVORITE_HUB_URL + '/' + this.props.hubEntry.id, value);
			}

			promise.catch(this._handleError);
			return promise;
		}

		return Promise.reject();
	},

	render: function () {
		let options = {
			fields: {
				share_profile: {
					factory: t.form.Select,
					options: this.state.profiles,
					nullOption: false,
					help: 'Custom share profiles can be selected only after entering an ADC hub address (starting with adc:// or adcs://)',
					transformer: {
						format: v => String(v),
						parse: v => parseInt(v, 10)
					}
				}
			}
		};

		const { error } = this.state;
		if (!!error) {
			options.fields[error.field] = options.fields[error.field] || {};
			Object.assign(options.fields[error.field], {
				error: error.message,
				hasError: true
			});
		}

		const title = this._isNew ? 'Add favorite hub' : 'Edit favorite hub';
		return (
			<Modal className="fav-hub" title={title} saveHandler={this.save} closable={false} icon="yellow star" {...this.props}>
				<Form
					ref="form"
					type={Entry}
					options={options}
					value={this.state.value}
					onChange={this.onChange}
				/>
			</Modal>);
	}
});
