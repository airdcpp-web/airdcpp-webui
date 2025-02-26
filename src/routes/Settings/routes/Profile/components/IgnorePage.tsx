import * as React from 'react';

import UserConstants from '@/constants/UserConstants';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from '@/decorators/DataProviderDecorator';
import Message from '@/components/semantic/Message';

import { UserMenu } from '@/components/action-menu';

import * as API from '@/types/api';
import { SettingPageProps } from '@/routes/Settings/types';
import MenuConstants from '@/constants/MenuConstants';

const Row: React.FC<{ ignoreInfo: API.IgnoredUser }> = ({ ignoreInfo }) => (
  <tr>
    <td className="user dropdown">
      <UserMenu
        ids={['unignore']}
        userIcon="simple"
        user={ignoreInfo.user}
        contextElement="#setting-scroll-context"
        remoteMenuId={MenuConstants.USER}
      />
    </td>
    <td className="count">{ignoreInfo.ignored_messages}</td>
  </tr>
);

const getRow = (ignoreInfo: API.IgnoredUser) => {
  return <Row key={ignoreInfo.user.cid} ignoreInfo={ignoreInfo} />;
};

type IgnorePageProps = SettingPageProps;

interface IgnorePageDataProps extends DataProviderDecoratorChildProps {
  ignores: API.IgnoredUser[];
}

const IgnorePage: React.FC<IgnorePageProps & IgnorePageDataProps> = ({
  ignores,
  moduleT,
}) => {
  const { translate } = moduleT;
  if (ignores.length === 0) {
    return <Message title={translate('No ignored users')} />;
  }

  return (
    <div>
      <table className="ui striped table">
        <thead>
          <tr>
            <th>{translate('User')}</th>
            <th>{translate('Messages ignored')}</th>
          </tr>
        </thead>
        <tbody>{ignores.map(getRow)}</tbody>
      </table>
    </div>
  );
};

export default DataProviderDecorator<IgnorePageProps, IgnorePageDataProps>(IgnorePage, {
  urls: {
    ignores: UserConstants.IGNORES_URL,
  },
  onSocketConnected: (addSocketListener, { refetchData }) => {
    addSocketListener(UserConstants.MODULE_URL, UserConstants.IGNORE_ADDED, () =>
      refetchData(),
    );
    addSocketListener(UserConstants.MODULE_URL, UserConstants.IGNORE_REMOVED, () =>
      refetchData(),
    );
  },
});
