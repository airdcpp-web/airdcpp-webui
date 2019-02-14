import React from 'react';

import FavoriteDirectoryActions from 'actions/FavoriteDirectoryActions';
import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';

import ActionButton from 'components/ActionButton';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import { ActionMenu } from 'components/menu';
import FavoriteDirectoryDialog from 'routes/Settings/routes/Downloads/components/FavoriteDirectoryDialog';

import * as API from 'types/api';
import * as UI from 'types/ui';


const Row: React.FC<{ directory: API.FavoriteDirectoryEntry; }> = ({ directory }) => (
  <tr>
    <td>
      <ActionMenu 
        caption={ <strong>{ directory.name }</strong> } 
        actions={ FavoriteDirectoryActions }
        itemData={ directory }
        contextElement="#setting-scroll-context"
      />
    </td>
    <td>
      { directory.path }
    </td>
  </tr>
);

const getRow = (directory: API.FavoriteDirectoryEntry) => {
  return (
    <Row 
      key={ directory.path } 
      directory={ directory }
    />
  );
};

interface FavoriteDirectoryPageProps {
  settingsT: UI.ModuleTranslator;
}

interface FavoriteDirectoryPageDataProps extends DataProviderDecoratorChildProps {
  directories: API.FavoriteDirectoryEntry[];
}

const FavoriteDirectoryPage: React.FC<FavoriteDirectoryPageProps & FavoriteDirectoryPageDataProps> = (
  { directories, settingsT }
) => (
  <div id="directory-table">
    <ActionButton
      actions={ FavoriteDirectoryActions }
      actionId="create"
    />

    { directories.length === 0 ? null : (
      <table className="ui striped table">
        <thead>
          <tr>
            <th>{ settingsT.translate('Name') }</th>
            <th>{ settingsT.translate('Path') }</th>
          </tr>
        </thead>
        <tbody>
          { directories.map(getRow) }
        </tbody>
      </table>
    ) }
    <FavoriteDirectoryDialog
      settingsT={ settingsT }
    />
  </div>
);

export default DataProviderDecorator<FavoriteDirectoryPageProps, FavoriteDirectoryPageDataProps>(
  FavoriteDirectoryPage, {
    urls: {
      directories: FavoriteDirectoryConstants.DIRECTORIES_URL,
    },
    onSocketConnected: (addSocketListener, { refetchData }) => {
      addSocketListener(
        FavoriteDirectoryConstants.MODULE_URL, 
        FavoriteDirectoryConstants.DIRECTORIES_UPDATED, 
        () => refetchData()
      );
    },
  }
);