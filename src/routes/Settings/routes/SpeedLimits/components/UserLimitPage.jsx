import React from 'react';
//import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';
import AutoValuePanel from './AutoValuePanel';

import t from 'utils/tcomb-form';

const Auto = {
	mcn_auto_limits: t.Bool,
	mcn_down: t.maybe(t.Num),
	mcn_up: t.maybe(t.Num),
};

const UserLimitPage = React.createClass({
	mixins: [ SettingPageMixin('auto-form') ],
	render() {
		return (
			<div className="user-limit-settings">
				<AutoValuePanel
					ref="auto-form"
					formItems={Auto}
				/>
			</div>
		);
	}
});

export default UserLimitPage;