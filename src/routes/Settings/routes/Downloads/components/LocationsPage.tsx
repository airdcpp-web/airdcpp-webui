import React from 'react';

import ExternalLink from 'components/ExternalLink';
import LinkConstants from 'constants/LinkConstants';
import Message from 'components/semantic/Message';

import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import FavoriteDirectoryTable from 'routes/Settings/routes/Downloads/components/FavoriteDirectoryTable';
import LayoutHeader from 'components/semantic/LayoutHeader';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';
import IconConstants from 'constants/IconConstants';


const Entry = [
  'download_directory',
];

const LocationsPage: React.FC<SettingSectionChildProps> = props => (
  <div>
    <RemoteSettingForm
      { ...props }
      keys={ Entry }
    />

    <Message 
      description={ (
        <ExternalLink url={ LinkConstants.VARIABLE_HELP_URL }>
          { props.moduleT.translate('Available path variables') }
        </ExternalLink>
      ) }
      icon={ IconConstants.INFO }
    />

    <div className="ui segment setting-form">
      <LayoutHeader 
        title={ props.moduleT.translate('Favorite download directories') }
        icon={ IconConstants.FOLDER }
        size="normal"
      />
      <FavoriteDirectoryTable
        moduleT={ props.moduleT }
      />
    </div>
  </div>
);

export default LocationsPage;