import React from 'react';
//import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

//import t from 'utils/tcomb-form';


const ShareDirectories = React.createClass({
	mixins: [ SettingPageMixin('form') ],

	render() {
		return (
			<div className="share-directories-settings">

			</div>
		);
	}
});

export default ShareDirectories;