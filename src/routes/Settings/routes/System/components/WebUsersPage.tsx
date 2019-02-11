import React from 'react';

import WebUserConstants from 'constants/WebUserConstants';
import WebUserActions from 'actions/WebUserActions';

import ActionButton from 'components/ActionButton';
import WebUserDialog from 'routes/Settings/routes/System/components/users/WebUserDialog';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import { ActionMenu } from 'components/menu';
import { formatRelativeTime } from 'utils/ValueFormat';

import * as API from 'types/api';


const WebUserRow: React.FC<{ user: API.WebUser }> = ({ user }) => (
  <tr>
    <td>
      <ActionMenu 
        caption={ <strong>{ user.username }</strong> }
        actions={ WebUserActions } 
        itemData={ user }
        contextElement="#setting-scroll-context"
      />
    </td>
    <td>
      { user.permissions.indexOf(API.AccessEnum.ADMIN) !== -1 ? 'Administrator' : user.permissions.length }
    </td>
    <td>
      { user.active_sessions }
    </td>
    <td>
      { formatRelativeTime(user.last_login) }
    </td>
  </tr>
);

interface WebUsersPageProps {

}

interface WebUsersPageDataProps extends DataProviderDecoratorChildProps {
  users: API.WebUser[];
}

class WebUsersPage extends React.Component<WebUsersPageProps & WebUsersPageDataProps> {
  static displayName = 'WebUsersPage';

  render() {
    const { users } = this.props;
    return (
      <div>
        <ActionButton 
          action={ WebUserActions.actions.create } 
          moduleId={ WebUserActions.moduleId }
        />
        <table className="ui striped table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Permissions</th>
              <th>Active sessions</th>
              <th>Last logged in</th>
            </tr>
          </thead>
          <tbody>
            { users.map(user => (
              <WebUserRow 
                key={ user.username } 
                user={ user } 
              />
            )) }
          </tbody>
        </table>
        <WebUserDialog/>
      </div>
    );
  }
}

export default DataProviderDecorator(WebUsersPage, {
  urls: {
    users: WebUserConstants.USERS_URL,
  },
  onSocketConnected: (addSocketListener, { refetchData }) => {
    addSocketListener(WebUserConstants.MODULE_URL, WebUserConstants.ADDED, () => refetchData());
    addSocketListener(WebUserConstants.MODULE_URL, WebUserConstants.UPDATED, () => refetchData());
    addSocketListener(WebUserConstants.MODULE_URL, WebUserConstants.REMOVED, () => refetchData());
  },
});