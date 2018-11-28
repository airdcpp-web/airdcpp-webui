import React, { useContext } from 'react';

//import ExternalLink from 'components/ExternalLink';
//import LinkConstants from 'constants/LinkConstants';
import Message from 'components/semantic/Message';
import Button from 'components/semantic/Button';
import { InstallPromptContext } from 'App';

import IconConstants from 'constants/IconConstants';
import { LocalSettings } from 'constants/SettingConstants';
import { useStore } from 'effects/StoreListenerEffect';
import LocalSettingStore from 'stores/LocalSettingStore';

import * as UI from 'types/ui';


interface InstallPromptProps {
  alwaysShow?: boolean;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ alwaysShow }) => {
  const localSettings = useStore<UI.FormValueMap>(LocalSettingStore);
  const prompt = useContext(InstallPromptContext);
  if (!prompt) {
    return null;
  }

  //if (process.env.DEMO_MODE === '1') {
  //  return null;
  //}

  if (!alwaysShow && !!localSettings[LocalSettings.NO_INSTALL_PROMPT]) {
    return null;
  }

  return (
    <Message 
      title="Install as local application"
      description={ (
        <div className="install-prompt">
          <p>
              This web application can be installed locally, providing a better user experience
          </p>
          <Button
            className="primary"
            caption="Install"
            onClick={ () => prompt!() }
            icon={ IconConstants.CREATE }
          />
          { !alwaysShow && (
            <Button
              caption="Don't install"
              onClick={ () => LocalSettingStore.setValue(LocalSettings.NO_INSTALL_PROMPT, true) }
            />
          ) }
        </div>
      ) }
    />
  );
};

export default InstallPrompt;