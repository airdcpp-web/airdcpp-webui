import React from 'react';

import ExternalLink from 'components/ExternalLink';
import LinkConstants from 'constants/LinkConstants';
import Message from 'components/semantic/Message';

import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import FavoriteDirectoryTable from './FavoriteDirectoryTable';
import LayoutHeader from 'components/semantic/LayoutHeader';

import t from 'utils/tcomb-form';


const Entry = {
	download_directory: t.Str,
};

const LocationsPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],
	render() {
		return (
			<div>
				<RemoteSettingForm
					ref="form"
					formItems={Entry}
				/>

				<Message 
					description={ <ExternalLink url={ LinkConstants.VARIABLE_HELP_URL }>Available path variables</ExternalLink> }
					icon="blue info"
				/>

				<div className="ui segment setting-form">
					<LayoutHeader title="Favorite download directories" icon="yellow folder" size="normal"/>
					<FavoriteDirectoryTable/>
				</div>
			</div>
		);
	}
});

export default LocationsPage;