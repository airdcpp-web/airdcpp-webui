import React from 'react';

import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import BrowseField from 'components/filebrowser/BrowseField';

import t from 'utils/tcomb-form';

const Entry = {
	download_directory: t.maybe(t.Str),
};

const LocationsPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	onFieldSetting(id, fieldOptions, formValue) {
		if (id === 'download_directory') {
			fieldOptions['factory'] = BrowseField(this.props.location);
		}
	},

	render() {
		return (
			<div className="personal-settings">
				<SettingForm
					ref="form"
					formItems={Entry}
					onFieldSetting={this.onFieldSetting}
				/>
			</div>
		);
	}
});

export default LocationsPage;