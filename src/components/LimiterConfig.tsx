//import PropTypes from 'prop-types';
import React from 'react';

import Button from 'components/semantic/Button';
import ActionInput from 'components/semantic/ActionInput';

import SettingConstants from 'constants/SettingConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';
import { useTranslation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';


interface LimiterConfigProps {
  limit: number;
  settingKey: string;
  hide: () => void;
}

const LimiterConfig: React.FC<LimiterConfigProps> = ({ hide, settingKey, limit: currentLimit }) => {
  /*static propTypes = {
    limit: PropTypes.number.isRequired,

    // Limiter API setting key to use for saving
    settingKey: PropTypes.string.isRequired,

    hide: PropTypes.func.isRequired,
  };*/

  const save = (newLimit = 0) => {
    SocketService.post(SettingConstants.ITEMS_SET_URL, {
      [settingKey]: newLimit,
    });

    hide();
  };

  const { t } = useTranslation();
  return (
    <div className="limiter-config">
      <div className="ui header">
        { translate('Enter limit (kB/s)', t, UI.Modules.COMMON) }
      </div>
      <ActionInput 
        placeholder={ translate('Enter limit...', t, UI.Modules.COMMON) } 
        type="number" 
        caption={ translate('Save', t, UI.Modules.COMMON) } 
        icon={ IconConstants.SAVE }
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