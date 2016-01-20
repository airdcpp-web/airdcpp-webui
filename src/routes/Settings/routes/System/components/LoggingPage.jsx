import React from 'react';

import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import Accordion from 'components/semantic/Accordion';
import LinkConstants from 'constants/LinkConstants';
import LogSection from './LogSection';
import Message from 'components/semantic/Message';

import t from 'utils/tcomb-form';

const Entry = {
	log_directory: t.Str,
};

const sections = [
	'main',
	'pm',
	'downloads',
	'uploads',
	'syslog',
	'status',
];

const LoggingPage = React.createClass({
	mixins: [ SettingPageMixin('form', ...sections) ],
	render() {
		return (
			<div className="logging-settings">
				<SettingForm
					ref="form"
					formItems={Entry}
				/>
				<div className="sections">
					<div className="ui header">Sections</div>
					<Message
						icon="blue info"
						description={ <a href={ LinkConstants.LOG_HELP_URL } target="_blank">Variable information for Filename and Format fields</a> }
					/>
					<Accordion className="styled" controlled={ true }>
						{ sections.map(section => <LogSection ref={ section } section={ section }/>) }
					</Accordion>
				</div>
			</div>
		);
	}
});

export default LoggingPage;