//import PropTypes from 'prop-types';
import React from 'react';

import ActionInput from 'components/semantic/ActionInput';
import Button from 'components/semantic/Button';

import HubActions from 'actions/reflux/HubActions';

import LoginStore from 'stores/LoginStore';
import Icon, { IconType } from 'components/semantic/Icon';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { Trans } from 'react-i18next';


interface HubActionPromptProps {
  icon: IconType;
  title: React.ReactNode;
  content: React.ReactNode;
}

// Main prompt (HUBS_EDIT permission is required for the content to be rendered)
const HubActionPrompt: React.FC<HubActionPromptProps> = (
  { icon, title, content }
) => {
  if (!LoginStore.hasAccess(API.AccessEnum.HUBS_EDIT)) {
    return null;
  }

  return (
    <div className="ui icon message hub-action-prompt">
      <h3 className="ui header">
        <Icon icon={ icon }/>
        <div className="content">
          { title }
        </div>
      </h3>
      { content }
    </div>
  );
};

/*HubActionPrompt.propTypes = {
  // Message title
  title: PropTypes.node.isRequired,

  // Children
  content: PropTypes.node.isRequired,
};*/


interface PasswordPromptProps {
  hub: API.Hub;
  sessionT: UI.ModuleTranslator;
}

// Sub prompts
const PasswordPrompt: React.FC<PasswordPromptProps> = ({ hub, sessionT }) => (
  <div>
    <ActionInput 
      placeholder={ sessionT.translate('Password') } 
      caption={ sessionT.translate('Submit') }
      icon="green play" 
      handleAction={ text => HubActions.password(hub, text) }
    />
    <div className="help">
      <Trans i18nKey={ sessionT.toI18nKey('passwordPromptHelp') }>
        This usually means that there's a registered account associated with your nick. 
        If you don't remember having a registered account in this hub, 
        there may be someone else using the same nick.
      </Trans>
    </div>
  </div>
);

interface RedirectPromptProps {
  hub: API.Hub;
  sessionT: UI.ModuleTranslator;
}

const RedirectPrompt: React.FC<RedirectPromptProps> = ({ hub, sessionT }) => (
  <Button
    icon="green play"
    onClick={ _ => HubActions.redirect(hub) }
    caption={ sessionT.t('acceptRedirect', {
      defaultValue: 'Accept redirect to {{url}}',
      replace: {
        url: hub.connect_state.data!.hub_url
      }
    }) }
  />
);

export { RedirectPrompt, PasswordPrompt, HubActionPrompt };