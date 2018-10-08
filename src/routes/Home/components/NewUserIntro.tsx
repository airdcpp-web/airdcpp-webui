import React from 'react';
import { Link } from 'react-router-dom';
import LinkConstants from 'constants/LinkConstants';

import ActionButton from 'components/ActionButton';
import ExternalLink from 'components/ExternalLink';
import TextDecorator from 'components/TextDecorator';
import Message from 'components/semantic/Message';

import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';


const NewUserIntro = () => {
  if (!LoginStore.showNewUserIntro) {
    return null;
  }

  return (
    <Message 
      title="Information for new user"
      description={ (
        <div className="new-user-message">
          <ul>
            <li>
              Add a few directories that are shared to other users from the <Link to="/share">Share</Link> page.
            </li>
            <li>
              You might want to go through at least each main page 
              of <Link to="/settings">the client settings</Link> before you start.
              &nbsp;
              <strong>
                It's important that 
                you <Link to="/settings/speed-limits/speed">configure your connection speed</Link> correctly 
                because the client won't be able to utilize your bandwidth efficiently otherwise.
              </strong>
            </li>
            <li>
              There is no listing of public hubs yet so you need to know the hub addresses where you wish to connect to.
            </li>
          </ul>
          <p>
            Visit the <ExternalLink url={ LinkConstants.HOME_PAGE_URL }>home page</ExternalLink> for more information 
            about the client and its features.
          </p>
          <TextDecorator
            text={ 
              <p>
                If you have questions, you may post them on 
                the <ExternalLink url={ LinkConstants.ISSUE_TRACKER_URL }>GitHub tracker</ExternalLink> or 
                join the dev/support hub: <span>{ LinkConstants.DEV_HUB_URL }</span>
              </p>
            }
          />
          <ActionButton 
            action={ LoginActions.newUserIntroSeen }
          />
        </div>
      ) }
    />
  );
};

export default NewUserIntro;