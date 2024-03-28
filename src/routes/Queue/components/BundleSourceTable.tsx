import * as React from 'react';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';

import { QueueBundleSourceActionMenu } from 'actions/ui/queue/QueueBundleSourceActions';
import QueueConstants from 'constants/QueueConstants';

import { formatSize, formatSpeed } from 'utils/ValueFormat';

import { ActionMenu, UserMenu } from 'components/action-menu';
import { UserFileActions } from 'actions/ui/user/UserActions';

import * as API from 'types/api';
import * as UI from 'types/ui';
import MenuConstants from 'constants/MenuConstants';

interface SourceProps {
  bundle: API.QueueBundle;
  source: API.QueueBundleSource;
  t: UI.TranslateF;
}

const Source: React.FC<SourceProps> = ({ source, bundle, t }) => (
  <tr>
    <td className="user dropdown">
      <UserMenu
        userIcon={true}
        user={source.user}
        ids={UserFileActions}
        contextElement=".source.modal"
        remoteMenuId={MenuConstants.HINTED_USER}
      >
        <ActionMenu
          actions={QueueBundleSourceActionMenu}
          //ids={ [ 'removeBundleSource' ]}
          itemData={{
            source,
            bundle,
          }}
        />
      </UserMenu>
    </td>
    <td className="hubs">{source.user.hub_names}</td>
    <td className="speed">
      {source.last_speed > 0 && formatSpeed(source.last_speed, t)}
    </td>
    <td className="files">{source.files}</td>
    <td className="size">{formatSize(source.size, t)}</td>
  </tr>
);

const userSort = (a: API.QueueBundleSource, b: API.QueueBundleSource) =>
  a.user.nicks.localeCompare(b.user.nicks);

interface BundleSourceTableProps {
  bundle: API.QueueBundle;
  queueT: UI.ModuleTranslator;
}

interface BundleSourceTableDataProps extends DataProviderDecoratorChildProps {
  sources: API.QueueBundleSource[];
}

const BundleSourceTable: React.FC<
  BundleSourceTableProps & BundleSourceTableDataProps
> = ({ sources, bundle, queueT }) => {
  const { translate } = queueT;

  return (
    <div className="sources">
      <h2>{translate('Sources')}</h2>
      <table className="ui striped table">
        <thead>
          <tr>
            <th>{translate('User')}</th>
            <th>{translate('Hubs')}</th>
            <th>{translate('Last known speed')}</th>
            <th>{translate('Files')}</th>
            <th>{translate('Size')}</th>
          </tr>
        </thead>
        <tbody>
          {sources.sort(userSort).map((source) => (
            <Source
              key={source.user.cid}
              source={source}
              bundle={bundle!}
              t={queueT.plainT}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataProviderDecorator<BundleSourceTableProps, BundleSourceTableDataProps>(
  BundleSourceTable,
  {
    urls: {
      sources: ({ bundle }, socket) =>
        socket.get(`${QueueConstants.BUNDLES_URL}/${bundle!.id}/sources`),
    },
    onSocketConnected: (addSocketListener, { refetchData, props }) => {
      addSocketListener<API.QueueBundle>(
        QueueConstants.MODULE_URL,
        QueueConstants.BUNDLE_SOURCES,
        (data) => {
          // Avoid flickering when there are many bundles running
          if (data.id === props.bundle!.id) {
            refetchData();
          }
        },
      );
    },
  },
);
