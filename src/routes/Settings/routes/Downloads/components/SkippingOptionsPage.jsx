import React from 'react';
import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	download_skip_zero_byte: t.Bool,
	dont_download_shared: t.Bool,
	dont_download_queued: t.Bool,
	download_dupe_min_size: t.Positive,
};

const Skiplist = {
	download_skiplist: t.maybe(t.Str),
	download_skiplist_regex: t.Bool,
};

const SkippingOptionsPage = React.createClass({
	mixins: [ SettingPageMixin('form', 'skiplist') ],
	render() {
		return (
			<div className="skipping-options-settings">
				<SettingForm
					ref="form"
					formItems={Entry}
				/>

				<SettingForm
					title="Skiplist"
					ref="skiplist"
					formItems={Skiplist}
				/>
			</div>
		);
	}
});

export default SkippingOptionsPage;