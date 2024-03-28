import * as React from 'react';

import WebUserConstants from 'constants/WebUserConstants';
import WebUserActions from 'actions/ui/system/WebUserActions';

import ActionButton from 'components/ActionButton';
import WebUserDialog from 'routes/Settings/routes/System/components/users/WebUserDialog';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';

import { ActionMenu } from 'components/action-menu';
import { formatRelativeTime } from 'utils/ValueFormat';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { SettingPageProps } from 'routes/Settings/types';

interface WebUserRowProps {
  user: API.WebUser;
  moduleT: UI.ModuleTranslator;
}

const WebUserRow: React.FC<WebUserRowProps> = ({ user, moduleT }) => (
  <tr>
    <td className="name dropdown">
      <ActionMenu
        caption={<strong>{user.username}</strong>}
        actions={WebUserActions.edit}
        itemData={user}
        contextElement="#setting-scroll-context"
      />
    </td>
    <td className="permissions">
      {user.permissions.includes(API.AccessEnum.ADMIN)
        ? moduleT.translate('Administrator')
        : user.permissions.length}
    </td>
    <td className="sessions">{user.active_sessions}</td>
    <td className="last-login">{formatRelativeTime(user.last_login)}</td>
  </tr>
);

interface WebUsersPageProps extends SettingPageProps {}

interface WebUsersPageDataProps extends DataProviderDecoratorChildProps {
  users: API.WebUser[];
}

class WebUsersPage extends React.Component<WebUsersPageProps & WebUsersPageDataProps> {
  static displayName = 'WebUsersPage';

  render() {
    const { users, moduleT } = this.props;
    const { translate } = moduleT;
    return (
      <div>
        <ActionButton actions={WebUserActions.create} actionId="create" />
        <table className="ui striped table">
          <thead>
            <tr>
              <th>{translate('Username')}</th>
              <th>{translate('Permissions')}</th>
              <th>{translate('Active sessions')}</th>
              <th>{translate('Last logged in')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <WebUserRow key={user.username} user={user} moduleT={moduleT} />
            ))}
          </tbody>
        </table>
        <WebUserDialog moduleT={moduleT} />
      </div>
    );
  }
}

export default DataProviderDecorator(WebUsersPage, {
  urls: {
    users: WebUserConstants.USERS_URL,
  },
  onSocketConnected: (addSocketListener, { refetchData }) => {
    addSocketListener(WebUserConstants.MODULE_URL, WebUserConstants.ADDED, () =>
      refetchData(),
    );
    addSocketListener(WebUserConstants.MODULE_URL, WebUserConstants.UPDATED, () =>
      refetchData(),
    );
    addSocketListener(WebUserConstants.MODULE_URL, WebUserConstants.REMOVED, () =>
      refetchData(),
    );
  },
});
