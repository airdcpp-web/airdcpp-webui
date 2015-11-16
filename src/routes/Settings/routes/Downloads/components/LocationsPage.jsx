import React from 'react';

import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	download_directory: t.maybe(t.Str),
};

const LocationsPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	render() {
		return (
			<div className="personal-settings">
				<SettingForm
					ref="form"
					formItems={Entry}
				/>
			</div>
		);
	}
});

export default LocationsPage;