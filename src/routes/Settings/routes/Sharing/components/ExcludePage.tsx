import * as React from 'react';
import SocketService from 'services/SocketService';

import { ShareActionModule, ShareRefreshAction } from 'actions/ui/share/ShareActions';
import {
  ShareExcludeActionModule,
  ShareExcludeAddAction,
  ShareExcludeEditMenu,
} from 'actions/ui/share/ShareExcludeActions';
import ShareConstants from 'constants/ShareConstants';

import ActionButton from 'components/ActionButton';
import { ActionMenu } from 'components/action-menu';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';
import { FileBrowserRouteDialog } from 'components/filebrowser';
import IconConstants from 'constants/IconConstants';
import Message from 'components/semantic/Message';
import FilesystemConstants from 'constants/FilesystemConstants';

import { SettingPageProps } from 'routes/Settings/types';
import { runBackgroundSocketAction } from 'utils/ActionUtils';

import * as UI from 'types/ui';
import { Trans } from 'react-i18next';

const Row: React.FC<{ path: string }> = ({ path }) => (
  <tr>
    <td className="path dropdown">
      <ActionMenu
        caption={<strong>{path}</strong>}
        actions={ShareExcludeEditMenu}
        itemData={path}
        contextElement="#setting-scroll-context"
      />
    </td>
  </tr>
);

const getRow = (path: string) => {
  return <Row key={path} path={path} />;
};

type ExcludePageProps = SettingPageProps;

interface ExcludePageDataProps extends DataProviderDecoratorChildProps {
  excludes: string[];
}

class ExcludePage extends React.Component<ExcludePageProps & ExcludePageDataProps> {
  static displayName = 'ExcludePage';

  render() {
    const { excludes, moduleT } = this.props;
    const { translate, toI18nKey } = moduleT;
    return (
      <div>
        <Message
          title={
            <div>
              <div>
                <Trans i18nKey={toI18nKey('shareRefreshNote')}>
                  Share must be refreshed for the changes to take effect
                </Trans>
              </div>
              <br />
              <ActionButton action={ShareRefreshAction} moduleData={ShareActionModule} />
            </div>
          }
          icon={IconConstants.INFO}
        />

        <ActionButton
          action={ShareExcludeAddAction}
          moduleData={ShareExcludeActionModule}
          className="add"
        />

        {excludes.length > 0 && (
          <table className="ui striped table">
            <thead>
              <tr>
                <th>{translate('Path')}</th>
              </tr>
            </thead>
            <tbody>{excludes.map(getRow)}</tbody>
          </table>
        )}

        <FileBrowserRouteDialog
          onConfirm={(path) =>
            runBackgroundSocketAction(
              () => SocketService.post(ShareConstants.EXCLUDES_ADD_URL, { path }),
              moduleT.plainT,
            )
          }
          initialPath=""
          historyId={FilesystemConstants.LOCATION_GENERIC}
          subHeader={translate('Add excluded path')}
          selectMode={UI.FileSelectModeEnum.DIRECTORY}
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
    addSocketListener(ShareConstants.MODULE_URL, ShareConstants.EXCLUDE_ADDED, () =>
      refetchData(),
    );
    addSocketListener(ShareConstants.MODULE_URL, ShareConstants.EXCLUDE_REMOVED, () =>
      refetchData(),
    );
  },
});
