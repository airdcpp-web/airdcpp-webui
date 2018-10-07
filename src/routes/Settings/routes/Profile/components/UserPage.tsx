import React from 'react';
import { SettingProfileEnum } from 'constants/SettingConstants';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';
import { FormFieldSettingHandler } from 'components/form/Form';

const Entry = [
  'nick',
  'description',
  'email',
  'setting_profile',
];

if (process.env.NODE_ENV !== 'production') {
  Entry.push('language');
}

const onFieldSetting: FormFieldSettingHandler = (id, fieldOptions, formValue) => {
  if (id === 'setting_profile') {
    switch (formValue[id]) {
      case SettingProfileEnum.NORMAL: {
        // tslint:disable-next-line:max-line-length
        fieldOptions['help'] = 'The client is used in normal private/public hubs for transferring files via internet. Use this profile if unsure.';
        break;
      }
      case SettingProfileEnum.RAR: {
        // tslint:disable-next-line:max-line-length
        fieldOptions['help'] = 'The client is used for transferring files that are split in RAR archives (or in other small-sized formats)';
        break;
      }
      case SettingProfileEnum.LAN: {
        // tslint:disable-next-line:max-line-length
        fieldOptions['help'] = 'The client is used for transferring files in local network (e.g. LAN parties) or in another closed network (e.g. university network)';
        break;
      }
      default:
    }
  }
};

const UserPage: React.SFC<SettingSectionChildProps> = props => (
  <div>
    <RemoteSettingForm
      { ...props }
      keys={ Entry }
      onFieldSetting={ onFieldSetting }
    />
  </div>
);

export default UserPage;