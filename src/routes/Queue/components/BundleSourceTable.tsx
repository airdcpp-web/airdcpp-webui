import React from 'react';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import QueueBundleActions from 'actions/QueueBundleActions';
import QueueConstants from 'constants/QueueConstants';

import IconConstants from 'constants/IconConstants';
import Message from 'components/semantic/Message';

import { formatSize, formatSpeed } from 'utils/ValueFormat';

import { ActionMenu, UserMenu } from 'components/menu';
import { UserFileActions } from 'actions/UserActions';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { useTranslation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';


interface SourceProps {
  bundle: API.QueueBundle;
  source: API.QueueBundleSource;
}

const Source: React.FC<SourceProps> = ({ source, bundle }) => (
  <tr>
    <td className="user dropdown">
      <UserMenu 
        userIcon={ true }
        user={ source.user }
        ids={ UserFileActions }
        contextElement=".source.modal"
      >
        <ActionMenu 
          actions={ QueueBundleActions } 
          ids={ [ 'removeBundleSource' ]} 
          itemData={ {
            source,
            bundle,
          } }
        />
      </UserMenu>
    </td>
    <td className="hubs">
      { source.user.hub_names }
    </td>
    <td className="speed">
      { source.last_speed > 0 && formatSpeed(source.last_speed) }
    </td>
    <td className="files">
      { source.files }
    </td>
    <td className="size">
      { formatSize(source.size) }
    </td>
  </tr>
);

const userSort = (a: API.QueueBundleSource, b: API.QueueBundleSource) => a.user.nicks.localeCompare(b.user.nicks);


interface BundleSourceTableProps {
  bundle?: API.QueueBundle; // REQUIRED, CLONED
}

interface BundleSourceTableDataProps extends DataProviderDecoratorChildProps {
  sources: API.QueueBundleSource[];
}

const BundleSourceTable: React.FC<BundleSourceTableProps & BundleSourceTableDataProps> = (
  { sources, bundle, dataError }
) => {
  const { t } = useTranslation();
  if (dataError) {
    return (
      <Message 
        title={ translate('Failed to load source listing', t, UI.Modules.QUEUE) }
        icon={ IconConstants.ERROR }
        description={ dataError.message }
      />
    );
  }

  return (
    <div className="sources">
      <h2>{ translate('Sources', t, UI.Modules.QUEUE) }</h2>
      <table className="ui striped table">
        <thead>
          <tr>
            <th>{ translate('User', t, UI.Modules.QUEUE) }</th>
            <th>{ translate('Hubs', t, UI.Modules.QUEUE) }</th>
            <th>{ translate('Last known speed', t, UI.Modules.QUEUE) }</th>
            <th>{ translate('Files', t, UI.Modules.QUEUE) }</th>
            <th>{ translate('Size', t, UI.Modules.QUEUE) }</th>
          </tr>
        </thead>
        <tbody>
          { sources.sort(userSort).map(source => (
            <Source 
              key={ source.user.cid }
              source={ source }
              bundle={ bundle! }
            />
          )) }
        </tbody>
      </table>
    </div>
  );
};

export default DataProviderDecorator<BundleSourceTableProps, BundleSourceTableDataProps>(BundleSourceTable, {
  urls: {
    sources: ({ bundle }, socket) => socket.get(`${QueueConstants.BUNDLES_URL}/${bundle!.id}/sources`),
  },
  onSocketConnected: (addSocketListener, { refetchData, props }) => {
    addSocketListener(QueueConstants.MODULE_URL, QueueConstants.BUNDLE_SOURCES, (data: API.QueueBundle) => {
      // Avoid flickering when there are many bundles running
      if (data.id === props.bundle!.id) {
        refetchData();
      }
    });
  },
  renderOnError: true,
});