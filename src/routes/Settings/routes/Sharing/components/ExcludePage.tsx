import React from 'react';

import ShareActions from 'actions/ShareActions';
import ShareConstants from 'constants/ShareConstants';

import ActionButton from 'components/ActionButton';
import { ActionMenu } from 'components/menu/DropdownMenu';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import FileBrowserDialog from 'components/filebrowser/FileBrowserDialog';
import IconConstants from 'constants/IconConstants';
import Message from 'components/semantic/Message';
import FilesystemConstants from 'constants/FilesystemConstants';


const Row: React.SFC<{ path: string; }> = ({ path }) => (
  <tr>
    <td>
      <ActionMenu 
        caption={ <strong>{ path }</strong> } 
        actions={ ShareActions } 
        ids={ [ 'removeExclude' ] } 
        itemData={ path }
        contextElement="#setting-scroll-context"
      />
    </td>
  </tr>
);


interface ExcludePageDataProps extends DataProviderDecoratorChildProps {
  excludes: string[];
}

class ExcludePage extends React.Component<ExcludePageDataProps> {
  static displayName = 'ExcludePage';

  getRow = (path: string) => {
    return (
      <Row 
        key={ path } 
        path={ path } 
      />
    );
  }

  render() {
    const { excludes } = this.props;
    return (
      <div>
        <Message
          title={
            <div>
              <div>
                Share must be refreshed for the changes to take effect
              </div>
              <br/>
              <ActionButton
                action={ ShareActions.refresh }
              />
            </div>
          }
          icon={ IconConstants.INFO }
        />

        <ActionButton
          action={ ShareActions.addExclude }
          className="add"
        />

        { excludes.length > 0 && (
          <table className="ui striped table">
            <thead>
              <tr>
                <th>Path</th>
              </tr>
            </thead>
            <tbody>
              { excludes.map(this.getRow) }
            </tbody>
          </table>
        ) }

        <FileBrowserDialog
          onConfirm={ ShareActions.addExclude.saved }
          initialPath=""
          historyId={ FilesystemConstants.LOCATION_GENERIC }
        />
      </div>
    );
  }
}

export default DataProviderDecorator(ExcludePage, {
  urls: {
    excludes: ShareConstants.EXCLUDES_URL,
  },
  onSocketConnected: (addSocketListener, { refetchData }) => {
    addSocketListener(ShareConstants.MODULE_URL, ShareConstants.EXCLUDE_ADDED, () => refetchData());
    addSocketListener(ShareConstants.MODULE_URL, ShareConstants.EXCLUDE_REMOVED, () => refetchData());
  },
});