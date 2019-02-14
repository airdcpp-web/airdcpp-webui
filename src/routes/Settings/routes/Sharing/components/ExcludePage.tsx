import React from 'react';

import ShareActions from 'actions/ShareActions';
import ShareExcludeActions from 'actions/ShareExcludeActions';
import ShareConstants from 'constants/ShareConstants';

import ActionButton from 'components/ActionButton';
import { ActionMenu } from 'components/menu';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import FileBrowserDialog from 'components/filebrowser/FileBrowserDialog';
import IconConstants from 'constants/IconConstants';
import Message from 'components/semantic/Message';
import FilesystemConstants from 'constants/FilesystemConstants';

import * as UI from 'types/ui';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';


const Row: React.FC<{ path: string; }> = ({ path }) => (
  <tr>
    <td>
      <ActionMenu 
        caption={ <strong>{ path }</strong> } 
        actions={ ShareExcludeActions } 
        ids={ [ 'remove' ] } 
        itemData={ path }
        contextElement="#setting-scroll-context"
      />
    </td>
  </tr>
);

const getRow = (path: string) => {
  return (
    <Row 
      key={ path } 
      path={ path } 
    />
  );
};


interface ExcludePageProps extends SettingSectionChildProps {

}

interface ExcludePageDataProps extends DataProviderDecoratorChildProps {
  excludes: string[];
}

class ExcludePage extends React.Component<ExcludePageProps & ExcludePageDataProps> {
  static displayName = 'ExcludePage';

  render() {
    const { excludes, settingsT } = this.props;
    const { translate, t } = settingsT;
    return (
      <div>
        <Message
          title={
            <div>
              <div>
                { t('shareRefreshNote', 'Share must be refreshed for the changes to take effect') }
              </div>
              <br/>
              <ActionButton
                actions={ ShareActions }
                actionId="refresh"
              />
            </div>
          }
          icon={ IconConstants.INFO }
        />

        <ActionButton
          actions={ ShareExcludeActions }
          actionId="add"
          className="add"
        />

        { excludes.length > 0 && (
          <table className="ui striped table">
            <thead>
              <tr>
                <th>{ translate('Path') }</th>
              </tr>
            </thead>
            <tbody>
              { excludes.map(getRow) }
            </tbody>
          </table>
        ) }

        <FileBrowserDialog
          onConfirm={ (ShareExcludeActions.actions.add as UI.EditorActionType<string>).saved }
          initialPath=""
          historyId={ FilesystemConstants.LOCATION_GENERIC }
          subHeader={ translate('Add excluded path') }
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