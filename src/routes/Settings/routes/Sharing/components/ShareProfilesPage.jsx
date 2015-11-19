import React from 'react';
//import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

//import t from 'utils/tcomb-form';


const ShareProfilesPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],

	render() {
		return (
			<div className="share-profiles-settings">

			</div>
		);
	}
});

export default ShareProfilesPage;