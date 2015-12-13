import React from 'react';
import Modal from 'components/semantic/Modal';

import WebUserConstants from 'constants/WebUserConstants';
import AccessConstants from 'constants/AccessConstants';
import PermissionSelector from './PermissionSelector';

import SocketService from 'services/SocketService';
import { RouteContext } from 'react-router';
import HistoryContext from 'mixins/HistoryContext';

import t from 'utils/tcomb-form';

import Form from 'components/Form';
import FormUtils from 'utils/FormUtils';
import LoginStore from 'stores/LoginStore';

import '../style.css';

const AccessCaptions = {
	ADMIN: 'Administrator',

	SEARCH: 'Search',
	DOWNLOAD: 'Download',
	EVENTS: 'Events: View',

	QUEUE_VIEW: 'Queue: View',
	QUEUE_EDIT: 'Queue: Modify',

	FAVORITE_HUBS_VIEW: 'Favorite hubs: View',
	FAVORITE_HUBS_EDIT: 'Favorite hubs: Modify',

	SETTINGS_VIEW: 'Settings: View',
	SETTINGS_EDIT: 'Settings: Edit',

	FILESYSTEM_VIEW: 'Local filesystem: Browse',
	FILESYSTEM_EDIT: 'Local filesystem: Edit',

	HUBS_VIEW: 'Hubs: View',
	HUBS_EDIT: 'Hubs: Modify',
	HUBS_SEND: 'Hubs: Send messages',

	PRIVATE_CHAT_VIEW: 'Private chat: View',
	PRIVATE_CHAT_EDIT: 'Private chat: Modify',
	PRIVATE_CHAT_SEND: 'Private chat: Send messages',

	FILELISTS_VIEW: 'Filelists: View',
	FILELISTS_EDIT: 'Filelists: Modify',
};


const reducePermissions = (options, key) => {
	options.push({
		value: AccessConstants[key],
		text: AccessCaptions[key],
	});

	return options;
};


const Entry = {
	username: t.Str,
	password: t.Str,
	permissions: t.list(t.String),
};

const WebUserDialog = React.createClass({
	mixins: [ RouteContext, HistoryContext ],

	getInitialState() {
		this._isNew = !this.props.user;

		return {
			sourceData: FormUtils.valueMapToInfo(this.props.user, Object.keys(Entry)),
			virtualNames: [],
		};
	},

	save() {
		return this.refs.form.save();
	},

	onSave(changedFields) {
		if (this._isNew) {
			return SocketService.post(WebUserConstants.USER_POST_URL, changedFields);
		}

		return SocketService.post(WebUserConstants.USER_UPDATE_URL, Object.assign(changedFields, { username: this.props.user.username }));
	},

	onFieldSetting(id, fieldOptions, formValue) {
		if (id === 'permissions') {
			fieldOptions['factory'] = t.form.Select;
			fieldOptions['template'] = PermissionSelector;
			fieldOptions['options'] = Object.keys(AccessConstants).reduce(reducePermissions, []);
			fieldOptions['disabled'] = !this._isNew && this.props.user.username === LoginStore.user;
		} else if (id === 'password') {
			fieldOptions['type'] = 'password';
			if (!this._isNew) {
				fieldOptions['label'] = 'New password (optional)';
			}
		} else if (id === 'username') {
			fieldOptions['disabled'] = !this._isNew;
		}
	},

	render: function () {
		const title = this._isNew ? 'Add web user' : 'Edit user ' + this.props.user.username;

		const context = {
			location: this.props.location,
		};

		let entry = Entry;
		if (!this._isNew) {
			entry = Object.assign({}, Entry, { password: t.maybe(t.Str) });
		}

		return (
			<Modal 
				className="web-user" 
				title={title} 
				onApprove={this.save} 
				closable={false} 
				icon={ "user" } 
				{...this.props}
			>
				<Form
					ref="form"
					formItems={entry}
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

export default WebUserDialog;