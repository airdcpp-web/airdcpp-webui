import * as React from 'react';
import classNames from 'classnames';

import { useFormatter } from 'utils/ValueFormat';
import Icon, { IconType, CornerIconType } from 'components/semantic/Icon';

import HashConstants from 'constants/HashConstants';
import IconConstants from 'constants/IconConstants';
import TransferConstants from 'constants/TransferConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { ErrorResponse } from 'airdcpp-apisocket';
import {
  SocketSubscriptionDecoratorChildProps,
  SocketSubscriptionDecorator,
} from 'decorators/SocketSubscriptionDecorator';
import { Translation } from 'react-i18next';
import { useSession } from 'context/SessionContext';

interface StatisticsIconProps {
  icon: IconType;
  cornerIcon?: CornerIconType;
  bytes: number;
  formatter: (bytes: number) => React.ReactNode;
  t: UI.TranslateF;
}

const StatisticsIcon: React.FC<StatisticsIconProps> = ({
  icon,
  cornerIcon,
  bytes,
  formatter,
  t,
}) => {
  if (bytes === 0) {
    return null;
  }

  return (
    <div className="item">
      {!!cornerIcon ? (
        <i
          className="icon"
          style={{
            paddingLeft: '0.2em',
          }}
        >
          <Icon icon={icon} cornerIcon={cornerIcon} />
        </i>
      ) : (
        <Icon icon={icon} />
      )}
      <div
        className="content"
        style={{
          paddingLeft: '.2em',
        }}
      >
        <div className="header">{formatter(bytes)}</div>
      </div>
    </div>
  );
};

interface StatisticsIconsProps {
  className?: string;
}

interface State
  extends Pick<API.TransferStats, 'speed_down' | 'speed_up' | 'queued_bytes'>,
    Pick<API.HashStats, 'hash_speed' | 'hash_bytes_left'> {}

const StatisticsIcons: React.FC<
  StatisticsIconsProps & SocketSubscriptionDecoratorChildProps
> = ({ socket, addSocketListener, className }) => {
  const { hasAccess } = useSession();
  const { formatSize, formatSpeed } = useFormatter();
  const [stats, setStats] = React.useState<State>({
    speed_down: 0,
    speed_up: 0,
    hash_speed: 0,
    hash_bytes_left: 0,
    queued_bytes: 0,
  });

  const onStatsReceived = (data: State) => {
    setStats({
      ...stats,
      ...data,
    });
  };

  const fetchStats = () => {
    if (hasAccess(API.AccessEnum.TRANSFERS)) {
      socket
        .get(TransferConstants.STATISTICS_URL)
        .then(onStatsReceived)
        .catch((error: ErrorResponse) =>
          console.error('Failed to fetch transfer statistics', error.message),
        );
    }
  };

  React.useEffect(() => {
    fetchStats();

    // eslint-disable-next-line max-len
    addSocketListener(
      TransferConstants.MODULE_URL,
      TransferConstants.STATISTICS,
      onStatsReceived,
      undefined,
      API.AccessEnum.TRANSFERS,
    );
    // eslint-disable-next-line max-len
    addSocketListener(
      HashConstants.MODULE_URL,
      HashConstants.STATISTICS,
      onStatsReceived,
      undefined,
      API.AccessEnum.SETTINGS_VIEW,
    );
  }, []);

  return (
    <Translation>
      {(t) => (
        <div
          className={classNames(
            'ui centered inverted mini list statistics-icons',
            className,
          )}
        >
          <StatisticsIcon
            icon={IconConstants.DOWNLOAD}
            bytes={stats.speed_down}
            formatter={formatSpeed}
            t={t}
          />
          <StatisticsIcon
            icon={IconConstants.UPLOAD}
            bytes={stats.speed_up}
            formatter={formatSpeed}
            t={t}
          />
          <StatisticsIcon
            icon={IconConstants.HASH}
            bytes={stats.hash_speed}
            formatter={formatSpeed}
            t={t}
          />
          <StatisticsIcon
            icon={IconConstants.QUEUE_COLORED}
            bytes={stats.queued_bytes}
            formatter={formatSize}
            t={t}
          />
        </div>
      )}
    </Translation>
  );
};

export default SocketSubscriptionDecorator<StatisticsIconsProps>(StatisticsIcons);
