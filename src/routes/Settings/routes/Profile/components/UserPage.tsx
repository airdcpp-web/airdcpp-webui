import * as React from 'react';
import { SettingProfileEnum } from '@/constants/SettingConstants';
import RemoteSettingForm from '@/routes/Settings/components/RemoteSettingForm';
import { SettingPageProps } from '@/routes/Settings/types';
import { FormFieldSettingHandler } from '@/components/form/Form';

import * as UI from '@/types/ui';
import { toFormI18nKey } from '@/utils/FormUtils';
import ExternalLink from '@/components/ExternalLink';
import LinkConstants from '@/constants/LinkConstants';
import { Trans } from 'react-i18next';

const Entry = ['nick', 'description', 'email', 'setting_profile', 'language_file'];

const FieldOptionGetter = (moduleT: UI.ModuleTranslator) => {
  const onFieldSetting: FormFieldSettingHandler = (id, fieldOptions, formValue) => {
    if (id === 'setting_profile') {
      let message;

      const profileId = formValue[id] as number;
      switch (profileId) {
        case SettingProfileEnum.NORMAL: {
          message =
            // eslint-disable-next-line max-len
            'The client is used in normal private/public hubs for transferring files via internet. Use this profile if unsure.';
          break;
        }
        case SettingProfileEnum.RAR: {
          message =
            // eslint-disable-next-line max-len
            'The client is used for transferring files that are split in RAR archives (or in other small-sized formats)';
          break;
        }
        case SettingProfileEnum.LAN: {
          message =
            // eslint-disable-next-line max-len
            'The client is used for transferring files in local network (e.g. LAN parties) or in another closed network (e.g. university network)';
          break;
        }
        default:
      }

      if (message) {
        fieldOptions.help = moduleT.t(
          toFormI18nKey(
            UI.TranslatableFormDefinitionProperties.HELP,
            id,
            profileId.toString(),
          ),
          message,
        );
      }
    } else if (id === 'language_file') {
      const translateHelp =
        'If you want to help with improving the existing translations or translate the \
application into a new language, please see the \
<url>instructions for translators</url>.';

      fieldOptions.help = (
        <>
          <p>
            <Trans
              i18nKey={moduleT.toI18nKey(
                toFormI18nKey(
                  UI.TranslatableFormDefinitionProperties.HELP,
                  id,
                  'Restart',
                ),
              )}
              defaults="The application must be restarted for the new language to take effect."
            />
          </p>
          <p>
            <Trans
              i18nKey={moduleT.toI18nKey(
                toFormI18nKey(
                  UI.TranslatableFormDefinitionProperties.HELP,
                  id,
                  'Translate',
                ),
              )}
              defaults={translateHelp}
              components={{
                url: <ExternalLink url={LinkConstants.TRANSLATOR_HELP} />,
              }}
            />
          </p>
        </>
      );
    }
  };

  return onFieldSetting;
};

const UserPage: React.FC<SettingPageProps> = ({ moduleT }) => (
  <div>
    <RemoteSettingForm keys={Entry} onFieldSetting={FieldOptionGetter(moduleT)} />
  </div>
);

export default UserPage;
