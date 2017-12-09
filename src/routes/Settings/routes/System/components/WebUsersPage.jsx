import React from 'react';

import WebUserActions from 'actions/WebUserActions';

import ActionButton from 'components/ActionButton';
import WebUserDialog from './users/WebUserDialog';
import WebUserLayout from './users/WebUserLayout';


class WebUsersPage extends React.Component {
  static displayName = 'WebUsersPage';

  render() {
    return (
      <div>
        <div className="table-actions">
          <ActionButton 
            action={ WebUserActions.create } 
          />
        </div>
        <WebUserLayout 
          className="user-layout" 
        />
        <WebUserDialog/>
      </div>
    );
  }
}

export default WebUsersPage;