//import PropTypes from 'prop-types';
import * as React from 'react';

import Button from 'components/semantic/Button';
import ActionInput from 'components/semantic/ActionInput';

import SettingConstants from 'constants/SettingConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';
import { toI18nKey, translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';
import { TFunction } from 'i18next';

import { runBackgroundSocketAction } from 'utils/ActionUtils';
import { formatUnit } from 'utils/ValueFormat';


interface LimiterConfigProps {
  limit: number;
  settingKey: string;
  hide: () => void;
  unit: string;
  t: TFunction;
}

const LimiterConfig: React.FC<LimiterConfigProps> = ({ hide, settingKey, limit: currentLimit, unit, t }) => {
  /*static propTypes = {
    limit: PropTypes.number.isRequired,

    // Limiter API setting key to use for saving
    settingKey: PropTypes.string.isRequired,

    hide: PropTypes.func.isRequired,
  };*/

  const save = (newLimit = 0) => {
    runBackgroundSocketAction(
      () => SocketService.post(SettingConstants.ITEMS_SET_URL, {
        [settingKey]: newLimit,
      }),
      t
    );

    hide();
  };

  return (
    <div className="limiter-config">
      <div className="ui header">
        { t(
            toI18nKey('enterLimitUnit', UI.Modules.COMMON),
            {
              defaultValue: 'Enter limit ({{unit}}/s)',
              replace: {
                unit: formatUnit(unit, t),
              }
            }
          ) }
      </div>
      <ActionInput 
        placeholder={ translate('Enter limit...', t, UI.Modules.COMMON) } 
        type="number" 
        caption={ translate('Save', t, UI.Modules.COMMON) } 
        icon={ IconConstants.SAVE_COLORED }
        handleAction={ text => save(parseInt(text)) }
      />
      { !!currentLimit && (
        <Button
          className="fluid remove"
          caption={ translate('Remove limit', t, UI.Modules.COMMON) }
          icon={ IconConstants.REMOVE }
          onClick={ () => save(0) }
        />
      ) }
    </div>
  );
};

export default LimiterConfig;