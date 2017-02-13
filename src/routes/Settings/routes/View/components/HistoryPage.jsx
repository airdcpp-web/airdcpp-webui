import React from 'react';

import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	history_search_max: t.Positive,
	history_download_max: t.Positive,
	history_chat_log_lines: t.Positive,
};

const MessageEntry = {
	history_hub_messages: t.Positive,
	history_pm_messages: t.Positive,
	history_log_messages: t.Positive,
};

const SessionEntry = {
	history_hub_sessions: t.Positive,
	history_pm_sessions: t.Positive,
	history_filelist_sessions: t.Positive,
};

const HistoryPage = React.createClass({
	mixins: [ SettingPageMixin('messages', 'histories', 'sessions') ],
	render() {
		return (
			<div>
				<RemoteSettingForm
					//title="Miscellaneous"
					ref="histories"
					formItems={ Entry }
				/>
				<RemoteSettingForm
					title="Maximum number of messages to cache"
					ref="messages"
					formItems={ MessageEntry }
				/>
				<RemoteSettingForm
					title="Maximum number of previously opened sessions"
					ref="sessions"
					formItems={ SessionEntry }
				/>
			</div>
		);
	}
});

export default HistoryPage;