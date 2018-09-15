import React from 'react';

import UserConstants from 'constants/UserConstants';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import Message from 'components/semantic/Message';

import { UserMenu } from 'components/menu/DropdownMenu';


const Row: React.SFC<{ ignoreInfo: API.IgnoredUser; }> = ({ ignoreInfo }) => (
  <tr>
    <td>
      <UserMenu 
        ids={ [ 'unignore' ] } 
        userIcon="simple"
        user={ ignoreInfo.user }
        contextElement="#setting-scroll-context"
      />
    </td>
    <td>
      { ignoreInfo.ignored_messages }
    </td>
  </tr>
);


interface IgnorePageDataProps extends DataProviderDecoratorChildProps {
  ignores: API.IgnoredUser[];
}

class IgnorePage extends React.Component<IgnorePageDataProps> {
  static displayName = 'IgnorePage';

  getRow = (ignoreInfo: API.IgnoredUser) => {
    return (
      <Row 
        key={ ignoreInfo.user.cid } 
        ignoreInfo={ ignoreInfo } 
      />
    );
  }

  render() {
    const { ignores } = this.props;
    if (ignores.length === 0) {
      return (
        <Message
          title="No ignored users"
        />
      );
    }

    return (
      <div>
        <table className="ui striped table">
          <thead>
            <tr>
              <th>User</th>
              <th>Messages ignored</th>
            </tr>
          </thead>
          <tbody>
            { ignores.map(this.getRow) }
          </tbody>
        </table>
      </div>
    );
  }
}

export default DataProviderDecorator(IgnorePage, {
  urls: {
    ignores: UserConstants.IGNORES_URL,
  },
  onSocketConnected: (addSocketListener, { refetchData }) => {
    addSocketListener(UserConstants.MODULE_URL, UserConstants.IGNORE_ADDED, () => refetchData());
    addSocketListener(UserConstants.MODULE_URL, UserConstants.IGNORE_REMOVED, () => refetchData());
  },
});