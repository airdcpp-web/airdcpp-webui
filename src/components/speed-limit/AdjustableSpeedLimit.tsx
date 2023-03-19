import * as React from 'react';

import LimiterConfig from 'components/speed-limit/LimiterConfig';
import Popup from 'components/semantic/Popup';

import LoginStore from 'stores/LoginStore';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { translate } from 'utils/TranslationUtils';

import './style.css';
import { useTranslation } from 'react-i18next';

export interface AdjustableSpeedLimitProps {
  limit: number;
  unit: string;
  settingKey: string;
}

export const AdjustableSpeedLimit: React.FC<AdjustableSpeedLimitProps> = ({
  limit,
  settingKey,
  unit,
}) => {
  const { t } = useTranslation();

  const value = limit
    ? `${limit} ${unit}/s`
    : translate('Disabled', t, UI.Modules.COMMON);
  if (!LoginStore.hasAccess(API.AccessEnum.SETTINGS_EDIT)) {
    return <span>{value}</span>;
  }

  return (
    <Popup triggerClassName="adjustable-speed-limit" className="limiter" trigger={value}>
      {(hide) => (
        <LimiterConfig
          limit={limit}
          settingKey={settingKey}
          hide={hide}
          unit={unit}
          t={t}
        />
      )}
    </Popup>
  );
};
