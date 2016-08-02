import React from 'react';

import ExternalLink from 'components/ExternalLink';
import LinkConstants from 'constants/LinkConstants';
import Message from 'components/semantic/Message';

import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';

const Entry = {
	download_directory: t.Str,
};

const LocationsPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	render() {
		return (
			<div>
				<SettingForm
					ref="form"
					formItems={Entry}
				/>

				<Message 
					description={
						<span>
							<div className="ui small header">Path variables</div>

							<ul>
								<li>
									<strong>%[username]</strong> - Replace with the name of the web user who queued the item (or with the system username if the download is initiated from the Windows GUI)
								</li>
							</ul>

							<p>
								<ExternalLink url={ LinkConstants.LOG_HELP_URL }>Available time formating variables</ExternalLink>
							</p>

							<p>
								<strong>
									Example:
								</strong>
								<br/>
								<i>/home/%[username]/Downloads/%Y-%m-%d/</i> (will be replaced with <i>/home/mywebuser/Downloads/2016-08-02/</i>)
							</p>
						</span>
					}
				/>
			</div>
		);
	}
});

/*							<div className="ui large header">
								<i className="blue info icon"/>
								Path variables
							</div>*/

export default LocationsPage;