import React from 'react';

import ExternalLink from 'components/ExternalLink';
import LinkConstants from 'constants/LinkConstants';
import Message from 'components/semantic/Message';

import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import FavoriteDirectoryTable from 'routes/Settings/routes/Downloads/components/FavoriteDirectoryTable';
import LayoutHeader from 'components/semantic/LayoutHeader';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';


const Entry = [
  'download_directory',
];

const LocationsPage: React.SFC<SettingSectionChildProps> = props => (
  <div>
    <RemoteSettingForm
      { ...props }
      keys={ Entry }
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

export default LocationsPage;