import React from 'react';
import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	prio_highest_size: t.Positive,
	prio_high_size: t.Positive,
	prio_normal_size: t.Positive,
	prio_auto_default: t.Bool,
};

const HighPrioEntry = {
	prio_high_files_to_highest: t.Bool,
	prio_high_files: t.Str,
	prio_high_files_regex: t.Bool,
};

const PrioritiesPage = React.createClass({
	mixins: [ SettingPageMixin('form', 'high-files') ],
	render() {
		return (
			<div>
				<SettingForm
					title="File priorities"
					ref="form"
					formItems={Entry}
				/>
				<SettingForm
					title="High priority files"
					ref="high-files"
					formItems={HighPrioEntry}
				/>
			</div>
		);
	}
});

export default PrioritiesPage;