import React from 'react';

import { LocalSettings } from 'constants/SettingConstants';
import LocalSettingForm from 'routes/Settings/components/LocalSettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';


const Entry = {
	[LocalSettings.UNREAD_LABEL_DELAY]: t.Positive,
	[LocalSettings.BACKGROUND_IMAGE_URL]: t.maybe(t.Str),
};

const MiscellaneousPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	render() {
		return (
			<div>
				<LocalSettingForm
					ref="form"
					formItems={ Entry }
				/>
			</div>
		);
	}
});

export default MiscellaneousPage;