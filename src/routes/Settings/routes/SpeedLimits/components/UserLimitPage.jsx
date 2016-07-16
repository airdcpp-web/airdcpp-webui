import React from 'react';

import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';
import AutoValuePanel from './AutoValuePanel';

import t from 'utils/tcomb-form';

const Auto = {
	mcn_auto_limits: t.Bool,
	mcn_down: t.Positive,
	mcn_up: t.Positive,
};

const UserLimitPage = React.createClass({
	mixins: [ SettingPageMixin('auto-form') ],
	render() {
		return (
			<div>
				<AutoValuePanel
					ref="auto-form"
					formItems={Auto}
					type="mcn"
				/>
			</div>
		);
	}
});

export default UserLimitPage;