import React from 'react';

import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import Accordion from 'components/semantic/Accordion';

import ExternalLink from 'components/ExternalLink';
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
			<div>
				<RemoteSettingForm
					ref="form"
					formItems={Entry}
				/>
				<div className="sections">
					<div className="ui header">Sections</div>
					<Message
						icon="blue info"
						description={ <ExternalLink url={ LinkConstants.VARIABLE_HELP_URL }>Variable information for Filename and Format fields</ExternalLink> }
					/>
					<Accordion className="styled" controlled={ true }>
						{ sections.map(section => 
							<LogSection 
								key={ section }
								ref={ section } 
								section={ section }
							/>
						) }
					</Accordion>
				</div>
			</div>
		);
	}
});

export default LoggingPage;