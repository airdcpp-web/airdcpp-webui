import React from 'react';
import Modal from 'components/semantic/Modal';

import ShareConstants from 'constants/ShareConstants';
import ShareRootConstants from 'constants/ShareRootConstants';
import IconConstants from 'constants/IconConstants';

import SocketService from 'services/SocketService';
import { RouteContext } from 'mixins/RouterMixin';
import ShareProfileDecorator from 'decorators/ShareProfileDecorator';

import Message from 'components/semantic/Message';

import t from 'utils/tcomb-form';

import FormUtils from 'utils/FormUtils';
import FileUtils from 'utils/FileUtils';

import Form from 'components/form/Form';
import BrowseField from 'components/form/BrowseField';
import FilesystemConstants from 'constants/FilesystemConstants';
import SelectField from 'components/form/SelectField';
import AutoSuggestField from 'components/form/AutoSuggestField';


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
	mixins: [ RouteContext ],

	getInitialState() {
		this._isNew = !this.props.rootEntry;

		const sourceData = FormUtils.valueMapToInfo(this.props.rootEntry, Object.keys(Entry));
		return {
			sourceData,
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
			const sourceData = FormUtils.valueMapToInfo({ 
				virtual_name: FileUtils.getLastDirectory(value.path, FileUtils) 
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
			return SocketService.post(ShareRootConstants.ROOT_POST_URL, changedFields);
		}

		return SocketService.post(ShareRootConstants.ROOT_UPDATE_URL, {
			path: this.props.rootEntry.path,
			...changedFields,
		});
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
			
			fieldOptions['config'] = Object.assign({} || fieldOptions['config'], {
				historyId: FilesystemConstants.LOCATION_DOWNLOAD,
			});
		} else if (id === 'virtual_name') {
			fieldOptions['help'] = 'Directories sharing the same virtual name will be merged in filelist';
			fieldOptions['factory'] = t.form.Textbox;
			fieldOptions['template'] = AutoSuggestField;
			fieldOptions['config'] = {
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
					formItems={Entry}
					onFieldChanged={this.onFieldChanged}
					onFieldSetting={this.onFieldSetting}
					onSave={this.onSave}
					sourceData={this.state.sourceData}
					defaultValues={ {
						// Add the default profile for new entries
						profiles: [ this.props.profiles.find(profile => profile.default).id ],
					} }
					context={ context }
				/>
			</Modal>
		);
	}
});

export default ShareProfileDecorator(ShareDirectoryDialog, false);