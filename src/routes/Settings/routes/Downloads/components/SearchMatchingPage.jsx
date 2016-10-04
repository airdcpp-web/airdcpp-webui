import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	auto_add_sources: t.Bool,
	alt_search_auto: t.Bool,
	alt_search_max_sources: t.Positive,
	max_sources_match_queue: t.Positive,
	allow_match_full_list: t.Bool,
};

const SearchMatchingPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	render() {
		return (
			<div>
				<RemoteSettingForm
					ref="form"
					formItems={Entry}
				/>
			</div>
		);
	}
});

export default SearchMatchingPage;