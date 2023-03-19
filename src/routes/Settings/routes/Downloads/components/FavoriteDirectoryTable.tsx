import * as React from 'react';

import FavoriteDirectoryActions from 'actions/ui/FavoriteDirectoryActions';
import FavoriteDirectoryConstants from 'constants/FavoriteDirectoryConstants';

import ActionButton from 'components/ActionButton';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';

import { ActionMenu } from 'components/menu';
import FavoriteDirectoryDialog from 'routes/Settings/routes/Downloads/components/FavoriteDirectoryDialog';

import * as API from 'types/api';
import * as UI from 'types/ui';

const Row: React.FC<{ directory: API.FavoriteDirectoryEntry }> = ({ directory }) => (
  <tr>
    <td className="name dropdown">
      <ActionMenu
        caption={<strong>{directory.name}</strong>}
        actions={FavoriteDirectoryActions.edit}
        itemData={directory}
        contextElement="#setting-scroll-context"
      />
    </td>
    <td className="path">{directory.path}</td>
  </tr>
);

const getRow = (directory: API.FavoriteDirectoryEntry) => {
  return <Row key={directory.path} directory={directory} />;
};

interface FavoriteDirectoryPageProps {
  moduleT: UI.ModuleTranslator;
}

interface FavoriteDirectoryPageDataProps extends DataProviderDecoratorChildProps {
  directories: API.FavoriteDirectoryEntry[];
}

const FavoriteDirectoryPage: React.FC<
  FavoriteDirectoryPageProps & FavoriteDirectoryPageDataProps
> = ({ directories, moduleT }) => (
  <div id="directory-table">
    <ActionButton actions={FavoriteDirectoryActions.create} actionId="create" />

    {directories.length === 0 ? null : (
      <table className="ui striped table">
        <thead>
          <tr>
            <th>{moduleT.translate('Name')}</th>
            <th>{moduleT.translate('Path')}</th>
          </tr>
        </thead>
        <tbody>{directories.map(getRow)}</tbody>
      </table>
    )}
    <FavoriteDirectoryDialog moduleT={moduleT} />
  </div>
);

export default DataProviderDecorator<
  FavoriteDirectoryPageProps,
  FavoriteDirectoryPageDataProps
>(FavoriteDirectoryPage, {
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
