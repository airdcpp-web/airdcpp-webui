import React from 'react';

import FavoriteDirectoryActions from 'actions/FavoriteDirectoryActions';
import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';

import ActionButton from 'components/ActionButton';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import { ActionMenu } from 'components/menu/DropdownMenu';
import FavoriteDirectoryDialog from 'routes/Settings/routes/Downloads/components/FavoriteDirectoryDialog';


const Row: React.SFC<{ directory: API.FavoriteDirectoryEntry; }> = ({ directory }) => (
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

}

interface FavoriteDirectoryPageDataProps extends DataProviderDecoratorChildProps {
  directories: API.FavoriteDirectoryEntry[];
}

const FavoriteDirectoryPage: React.SFC<FavoriteDirectoryPageProps & FavoriteDirectoryPageDataProps> = (
  { directories }
) => (
  <div id="directory-table">
    <ActionButton
      action={ FavoriteDirectoryActions.create }
    />

    { directories.length === 0 ? null : (
      <table className="ui striped table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Path</th>
          </tr>
        </thead>
        <tbody>
          { directories.map(getRow) }
        </tbody>
      </table>
    ) }
    <FavoriteDirectoryDialog/>
  </div>
);

export default DataProviderDecorator(FavoriteDirectoryPage, {
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
});