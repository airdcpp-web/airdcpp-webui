import PropTypes from 'prop-types';
import React from 'react';

import ActionInput from 'components/semantic/ActionInput';
import Button from 'components/semantic/Button';

import HubActions from 'actions/HubActions';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';


// Main prompt (HUBS_EDIT permission is required for the content to be rendered)
const HubActionPrompt = ({ icon, title, content }) => {
  if (!LoginStore.hasAccess(AccessConstants.HUBS_EDIT)) {
    return null;
  }

  return (
    <div className="ui icon message hub-action-prompt">
      <h3 className="ui header">
        <i className={ icon + ' icon'}/>
        <div className="content">
          { title }
        </div>
      </h3>
      { content }
    </div>
  );
};

HubActionPrompt.propTypes = {
  /**
	 * Message title
	 */
  title: PropTypes.node.isRequired,

  /**
	 * Children
	 */
  content: PropTypes.node.isRequired,
};


// Sub prompts
const PasswordPrompt = ({ hub }) => (
  <div>
    <ActionInput 
      placeholder="Password" 
      caption="Submit" 
      icon="green play" 
      handleAction={ text => HubActions.password(hub, text) }
    />
    <div className="help">
			This usually means that there's a registered account associated with your nick. 
			If you don't remember having a registered account in this hub, 
			there may be someone else using the same nick.
    </div>
  </div>
);

const RedirectPrompt = ({ hub }) => (
  <Button
    icon="green play"
    onClick={ _ => HubActions.redirect(hub) }
    caption={ 'Accept redirect to ' + hub.connect_state.data.hub_url }
  />
);

export { RedirectPrompt, PasswordPrompt, HubActionPrompt };