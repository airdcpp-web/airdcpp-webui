import React from 'react';
import { SettingProfileEnum } from 'constants/SettingConstants';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';
import { FormFieldSettingHandler } from 'components/form/Form';

import * as UI from 'types/ui';
import { toFormI18nKey } from 'utils/FormUtils';


const Entry = [
  'nick',
  'description',
  'email',
  'setting_profile',
  'language_file'
];

const FieldOptionGetter = (moduleT: UI.ModuleTranslator) => {
  const onFieldSetting: FormFieldSettingHandler = (id, fieldOptions, formValue) => {
    if (id === 'setting_profile') {
      let message;

      const profileId = formValue[id] as number;
      switch (profileId) {
        case SettingProfileEnum.NORMAL: {
          // tslint:disable-next-line:max-line-length
          message = 'The client is used in normal private/public hubs for transferring files via internet. Use this profile if unsure.';
          break;
        }
        case SettingProfileEnum.RAR: {
          // tslint:disable-next-line:max-line-length
          message = 'The client is used for transferring files that are split in RAR archives (or in other small-sized formats)';
          break;
        }
        case SettingProfileEnum.LAN: {
          // tslint:disable-next-line:max-line-length
          message = 'The client is used for transferring files in local network (e.g. LAN parties) or in another closed network (e.g. university network)';
          break;
        }
        default:
      }

      if (message) {
        fieldOptions['help'] = moduleT.t(
          toFormI18nKey(UI.TranslatableFormDefinitionProperties.HELP, id, profileId.toString()),
          message
        );
      }
    }
  };

  return onFieldSetting;
};

const UserPage: React.FC<SettingSectionChildProps> = props => (
  <div>
    <RemoteSettingForm
      { ...props }
      keys={ Entry }
      onFieldSetting={ FieldOptionGetter(props.moduleT) }
    />
  </div>
);

export default UserPage;