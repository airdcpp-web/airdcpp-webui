import React from 'react';

import createReactClass from 'create-react-class';

import WebUserActions from 'actions/WebUserActions';

import ActionButton from 'components/ActionButton';
import WebUserLayout from './users/WebUserLayout';

import { LocationContext } from 'mixins/RouterMixin';


const WebUsersPage = createReactClass({
  displayName: 'WebUsersPage',
  mixins: [ LocationContext ],

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
      </div>
    );
  },
});

export default WebUsersPage;