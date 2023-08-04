import * as React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import LoginStore from 'stores/LoginStore';

import * as API from 'types/api';
import * as UI from 'types/ui';

import '../style.css';
import { SettingPageProps } from 'routes/Settings/types';
import { FormFieldSettingHandler } from 'components/form/Form';
import { Trans } from 'react-i18next';
import { toFormI18nKey } from 'utils/FormUtils';

const FieldOptionGetter = (moduleT: UI.ModuleTranslator) => {
  const onFieldSetting: FormFieldSettingHandler = (id, fieldOptions, formValue) => {
    //const { toI18nKey } = this.props.moduleT;
    if (id === 'nmdc_encoding') {
      fieldOptions.help = (
        <Trans
          i18nKey={moduleT.toI18nKey(
            toFormI18nKey(UI.TranslatableFormDefinitionProperties.HELP, id, undefined),
          )}
        >
          <div>
            Encoding setting is only used in NMDC hubs. ADC hubs will always use UTF-8
            encoding.
            <br />
            <br />
            <div>
              Commonly used values:
              <ul>
                <li>Central Europe: cp1250</li>
                <li>Cyrillic: cp1251</li>
                <li>Western Europe: cp1252</li>
                <li>Greek: cp1253</li>
                <li>Turkish: cp1254</li>
                <li>Hebrew: cp1256</li>
              </ul>
            </div>
          </div>
        </Trans>
      );
    }
  };

  return onFieldSetting;
};

const Entry = [
  'auto_follow_redirects',
  'disconnect_offline_users',
  'disconnect_hubs_noreg',
  'min_search_interval',
];

const MiscPage: React.FC<SettingPageProps> = ({ moduleT }) => {
  // The locale-specific system encoding is used on Windows by default
  // while other system use UTF-8
  if (LoginStore.systemInfo.platform !== API.PlatformEnum.WINDOWS) {
    Entry.push('nmdc_encoding');
  }

  return (
    <div>
      <RemoteSettingForm keys={Entry} onFieldSetting={FieldOptionGetter(moduleT)} />
    </div>
  );
};

export default MiscPage;
