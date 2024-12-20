import * as React from 'react';

import LimiterConfig from 'components/speed-limit/LimiterConfig';
import Popup from 'components/semantic/Popup';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { translate } from 'utils/TranslationUtils';

import './style.css';
import { useTranslation } from 'react-i18next';
import { useSession } from 'context/SessionContext';

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
  const { hasAccess } = useSession();

  const value = limit
    ? `${limit} ${unit}/s`
    : translate('Disabled', t, UI.Modules.COMMON);
  if (!hasAccess(API.AccessEnum.SETTINGS_EDIT)) {
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
