import React from 'react';

import WebUserConstants from 'constants/WebUserConstants';
import WebUserActions from 'actions/WebUserActions';

import ActionButton from 'components/ActionButton';
import WebUserDialog from './users/WebUserDialog';

import AccessConstants from 'constants/AccessConstants';
import DataProviderDecorator from 'decorators/DataProviderDecorator';

import { ActionMenu } from 'components/menu/DropdownMenu';
import { formatRelativeTime } from 'utils/ValueFormat';


const WebUserRow = ({ user }) => (
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
      { user.permissions.indexOf(AccessConstants.ADMIN) !== -1 ? 'Administrator' : user.permissions.length }
    </td>
    <td>
      { user.active_sessions }
    </td>
    <td>
      { formatRelativeTime(user.last_login) }
    </td>
  </tr>
);

class WebUsersPage extends React.Component {
  static displayName = 'WebUsersPage';

  render() {
    const { users } = this.props;
    return (
      <div>
        <ActionButton 
          action={ WebUserActions.create } 
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
    addSocketListener(WebUserConstants.MODULE_URL, WebUserConstants.ADDED, _ => refetchData());
    addSocketListener(WebUserConstants.MODULE_URL, WebUserConstants.UPDATED, _ => refetchData());
    addSocketListener(WebUserConstants.MODULE_URL, WebUserConstants.REMOVED, _ => refetchData());
  },
});