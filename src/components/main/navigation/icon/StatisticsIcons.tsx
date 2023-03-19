import * as React from 'react';
import classNames from 'classnames';

import SocketService from 'services/SocketService';
import { formatSize, formatSpeed } from 'utils/ValueFormat';
import Icon, { IconType, CornerIconType } from 'components/semantic/Icon';

import LoginStore from 'stores/LoginStore';

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

interface StatisticsIconProps {
  icon: IconType;
  cornerIcon?: CornerIconType;
  bytes: number;
  formatter: (bytes: number, t: UI.TranslateF) => React.ReactNode;
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
        <div className="header">{formatter(bytes, t)}</div>
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

class StatisticsIcons extends React.PureComponent<
  StatisticsIconsProps & SocketSubscriptionDecoratorChildProps,
  State
> {
  //displayName: 'StatisticsIcons',

  state: State = {
    speed_down: 0,
    speed_up: 0,
    hash_speed: 0,
    hash_bytes_left: 0,
    queued_bytes: 0,
  };

  fetchStats = () => {
    if (LoginStore.hasAccess(API.AccessEnum.TRANSFERS)) {
      SocketService.get(TransferConstants.STATISTICS_URL)
        .then(this.onStatsReceived)
        .catch((error: ErrorResponse) =>
          console.error('Failed to fetch transfer statistics', error.message)
        );
    }
  };

  componentDidMount() {
    this.fetchStats();

    const { addSocketListener } = this.props;

    // eslint-disable-next-line max-len
    addSocketListener(
      TransferConstants.MODULE_URL,
      TransferConstants.STATISTICS,
      this.onStatsReceived,
      undefined,
      API.AccessEnum.TRANSFERS
    );
    // eslint-disable-next-line max-len
    addSocketListener(
      HashConstants.MODULE_URL,
      HashConstants.STATISTICS,
      this.onStatsReceived,
      undefined,
      API.AccessEnum.SETTINGS_VIEW
    );
  }

  onStatsReceived = (data: State) => {
    this.setState({
      ...data,
    });
  };

  render() {
    return (
      <Translation>
        {(t) => (
          <div
            className={classNames(
              'ui centered inverted mini list statistics-icons',
              this.props.className
            )}
          >
            <StatisticsIcon
              icon={IconConstants.DOWNLOAD}
              bytes={this.state.speed_down}
              formatter={formatSpeed}
              t={t}
            />
            <StatisticsIcon
              icon={IconConstants.UPLOAD}
              bytes={this.state.speed_up}
              formatter={formatSpeed}
              t={t}
            />
            <StatisticsIcon
              icon={IconConstants.HASH}
              bytes={this.state.hash_speed}
              formatter={formatSpeed}
              t={t}
            />
            <StatisticsIcon
              icon={IconConstants.QUEUE_COLORED}
              bytes={this.state.queued_bytes}
              formatter={formatSize}
              t={t}
            />
          </div>
        )}
      </Translation>
    );
  }
}

export default SocketSubscriptionDecorator<StatisticsIconsProps>(StatisticsIcons);
