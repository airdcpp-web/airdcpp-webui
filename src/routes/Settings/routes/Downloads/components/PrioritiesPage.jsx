import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
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
				<RemoteSettingForm
					title="File priorities"
					ref="form"
					formItems={Entry}
				/>
				<RemoteSettingForm
					title="High priority files"
					ref="high-files"
					formItems={HighPrioEntry}
				/>
			</div>
		);
	}
});

export default PrioritiesPage;