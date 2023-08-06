import { useContext } from 'react';
import * as React from 'react';

//import ExternalLink from 'components/ExternalLink';
//import LinkConstants from 'constants/LinkConstants';
import Message from 'components/semantic/Message';
import Button from 'components/semantic/Button';

import IconConstants from 'constants/IconConstants';
import { LocalSettings } from 'constants/SettingConstants';
import { useStore } from 'effects/StoreListenerEffect';
import LocalSettingStore from 'stores/LocalSettingStore';
import { InstallPromptContext } from 'context/InstallPromptContext';

import * as UI from 'types/ui';

import { translate, toI18nKey } from 'utils/TranslationUtils';
import { useTranslation } from 'react-i18next';

interface InstallPromptProps {
  alwaysShow?: boolean;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ alwaysShow }) => {
  const localSettings = useStore<UI.FormValueMap>(LocalSettingStore);
  const prompt = useContext(InstallPromptContext);
  const { t } = useTranslation();
  if (!prompt) {
    return null;
  }

  if (!alwaysShow && !!localSettings[LocalSettings.NO_INSTALL_PROMPT]) {
    return null;
  }

  return (
    <Message
      title={translate('Install as local application', t, UI.Modules.COMMON)}
      description={
        <div className="install-prompt">
          <p>
            {t(
              toI18nKey('pwaInstallDesc', UI.Modules.COMMON),
              'This web application can be installed locally, providing a better user experience',
            )}
          </p>
          <Button
            className="primary"
            caption={translate('Install', t, UI.Modules.COMMON)}
            onClick={() => prompt!()}
            icon={IconConstants.CREATE}
          />
          {!alwaysShow && (
            <Button
              caption={translate(`Don't install`, t, UI.Modules.COMMON)}
              onClick={() =>
                LocalSettingStore.setValue(LocalSettings.NO_INSTALL_PROMPT, true)
              }
            />
          )}
        </div>
      }
    />
  );
};

export default InstallPrompt;
