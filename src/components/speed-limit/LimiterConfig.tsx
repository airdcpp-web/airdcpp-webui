import * as React from 'react';

import Button from '@/components/semantic/Button';
import ActionInput from '@/components/semantic/ActionInput';

import SettingConstants from '@/constants/SettingConstants';

import IconConstants from '@/constants/IconConstants';
import { toI18nKey, translate } from '@/utils/TranslationUtils';

import * as UI from '@/types/ui';

import { runBackgroundSocketAction } from '@/utils/ActionUtils';
import { Trans } from 'react-i18next';
import { useSocket } from '@/context/SocketContext';
import { useFormatter } from '@/context/FormatterContext';

interface LimiterConfigProps {
  limit: number;

  // Limiter API setting key to use for saving
  settingKey: string;

  hide: () => void;
  unit: string;
  t: UI.TranslateF;
}

const LimiterConfig: React.FC<LimiterConfigProps> = ({
  hide,
  settingKey,
  limit: currentLimit,
  unit,
  t,
}) => {
  const { formatUnit } = useFormatter();
  const socket = useSocket();
  const save = (newLimit = 0) => {
    runBackgroundSocketAction(
      () =>
        socket.post(SettingConstants.ITEMS_SET_URL, {
          [settingKey]: newLimit,
        }),
      t,
    );

    hide();
  };

  return (
    <div className="limiter-config">
      <div className="ui header">
        <Trans
          i18nKey={toI18nKey('enterLimitUnit', UI.Modules.COMMON)}
          defaultValue={'Enter limit ({{unit}}/s)'}
          values={{
            unit: formatUnit(unit),
          }}
        />
      </div>
      <ActionInput
        placeholder={translate('Enter limit...', t, UI.Modules.COMMON)}
        type="number"
        caption={translate('Save', t, UI.Modules.COMMON)}
        icon={IconConstants.SAVE_COLORED}
        handleAction={(text) => save(parseInt(text))}
      />
      {!!currentLimit && (
        <Button
          className="fluid remove"
          caption={translate('Remove limit', t, UI.Modules.COMMON)}
          icon={IconConstants.REMOVE}
          onClick={() => save(0)}
        />
      )}
    </div>
  );
};

export default LimiterConfig;
