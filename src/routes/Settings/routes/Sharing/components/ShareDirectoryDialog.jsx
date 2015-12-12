import React from 'react';
import Modal from 'components/semantic/Modal';

import ShareConstants from 'constants/ShareConstants';
import ShareRootConstants from 'constants/ShareRootConstants';
import IconConstants from 'constants/IconConstants';

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
import AutoSuggestField from 'components/autosuggest/AutoSuggestField';

const ProfileList = t.refinement(t.list(t.Num), (n) => {
	return n.length > 0;
});


const Entry = {
	path: t.Str,
	virtual_name: t.Str,
	profiles: ProfileList,
	incoming: t.Bool,
};

const ShareDirectoryDialog = React.createClass({
	mixins: [ RouteContext, HistoryContext ],

	getInitialState() {
		this._isNew = !this.props.rootEntry;

		return {
			sourceData: FormUtils.valueMapToInfo(this.props.rootEntry, Object.keys(Entry)),
			virtualNames: [],
		};
	},

	componentDidMount() {
		this.fetchRoots();
	},

	onRootsReceived(data) {
		this.setState({
			virtualNames: data.map(item => item.name, []),
		});
	},

	fetchRoots() {
		SocketService.get(ShareConstants.GROUPED_ROOTS_GET_URL)
			.then(this.onRootsReceived)
			.catch(error => 
				console.error('Failed to load roots: ' + error)
			);
	},


	onFieldChanged(id, value, hasChanges) {
		if (id.indexOf('path') != -1) {
			const sourceData = FormUtils.valueMapToInfo({ virtual_name: FileUtils.getLastDirectory(value.path, FileUtils) });
			return Promise.resolve(sourceData);
		}
	},

	save() {
		return this.refs.form.save();
	},

	onSave(changedFields) {
		if (this._isNew) {
			return SocketService.post(ShareRootConstants.ROOT_POST_URL, changedFields);
		}

		return SocketService.post(ShareRootConstants.ROOT_UPDATE_URL, Object.assign(changedFields, { path: this.props.rootEntry.path }));
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
			});
		} else if (id === 'path') {
			if (this._isNew) {
				fieldOptions['factory'] = t.form.Textbox;
				fieldOptions['template'] = BrowseField;
			} else {
				fieldOptions['disabled'] = true;
			}
		} else if (id === 'virtual_name') {
			fieldOptions['factory'] = t.form.Textbox;
			fieldOptions['template'] = AutoSuggestField;
			fieldOptions['attrs'] = {
				suggestionGetter: () => this.state.virtualNames,
			};
		}
	},

	render: function () {
		if (!this.state.virtualNames) {
			return null;
		}

		const title = this._isNew ? 'Add share directory' : 'Edit share directory';

		const context = {
			location: this.props.location,
		};

		return (
			<Modal 
				className="share-directory" 
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

export default ShareProfileDecorator(ShareDirectoryDialog, false);