import { PureComponent } from 'react';

//@ts-ignore
import { TimeSeries } from 'pondjs';

import Loader from 'components/semantic/Loader';
import StatColumn from './StatColumn';
import SpeedChart from './SpeedChart';

import SocketService from 'services/SocketService';

import TransferConstants from 'constants/TransferConstants';

import { withContentRect, MeasuredComponentProps } from 'react-measure';

import '../style.css';

import * as API from 'types/api';
import * as UI from 'types/ui';

import {
  SocketSubscriptionDecoratorChildProps,
  SocketSubscriptionDecorator,
} from 'decorators/SocketSubscriptionDecorator';

const IDLE_APPEND_INTERVAL_MS = 3000;
const MAX_EVENTS = 1800; // 30 minutes when transfers are running

const addSpeed = (points: any[], down: number, up: number) => {
  const ret = [...points, [Date.now(), down, up]];

  if (ret.length > MAX_EVENTS) {
    ret.shift();
  }

  return ret;
};

interface State {
  points: Array<number[]>;
  maxDownload: number;
  maxUpload: number;
  stats?: API.TransferStats;
}

interface TransferProps extends MeasuredComponentProps, UI.WidgetProps {}

const hasEllapsedSinceLastUpdate = (points: State['points'], ms: number) => {
  return points[points.length - 1][0] + ms <= Date.now();
};

class Transfers extends PureComponent<
  TransferProps & SocketSubscriptionDecoratorChildProps,
  State
> {
  //displayName: 'Transfers',

  idleInterval: number | undefined;

  state: State = {
    points: [[Date.now(), 0, 0]],
    maxDownload: 0,
    maxUpload: 0,
  };

  componentDidMount() {
    this.initStats();
  }

  componentWillUnmount() {
    clearInterval(this.idleInterval);
  }

  checkIdle = () => {
    const { points } = this.state;
    if (hasEllapsedSinceLastUpdate(points, IDLE_APPEND_INTERVAL_MS - 200)) {
      this.setState({
        points: addSpeed(points, 0, 0),
      });
    }
  };

  initStats = async () => {
    try {
      const stats = await SocketService.get<API.TransferStats>(
        TransferConstants.STATISTICS_URL
      );
      this.onStatsReceived(stats);
    } catch (error) {
      console.error('Failed to fetch transfer statistics', error.message);
    }

    // Add lister
    const { addSocketListener } = this.props;
    addSocketListener(
      TransferConstants.MODULE_URL,
      TransferConstants.STATISTICS,
      this.onStatsUpdated
    );

    // Add zero values when there is no traffic
    this.idleInterval = window.setInterval(this.checkIdle, IDLE_APPEND_INTERVAL_MS);
  };

  onStatsReceived = (stats: API.TransferStats) => {
    this.setState({
      points: addSpeed(this.state.points, stats.speed_down, stats.speed_up),
      maxDownload: Math.max(stats.speed_down, this.state.maxDownload),
      maxUpload: Math.max(stats.speed_up, this.state.maxUpload),
      stats,
    });
  };

  onStatsUpdated = (newStats: Partial<API.TransferStats>) => {
    const { stats: oldStats, points } = this.state;

    // Ignore updates that are received in bursts
    // The precision of Date.now() has been slightly reduced/randomized,
    // which is possibly causing crashes in the TimeSeries creation at the render method
    // due to unchronological events in the series
    //
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
    if (!hasEllapsedSinceLastUpdate(points, 100)) {
      //console.log(`Transfer widget: burst update ignored`);
      return;
    }

    this.onStatsReceived({
      ...oldStats!,
      ...newStats,
    });
  };

  componentDidCatch(e: Error) {
    console.error(`Error in Transfer widget: ${e}`);
  }

  render() {
    const { measureRef, contentRect, widgetT } = this.props;
    const { points, maxDownload, maxUpload, stats } = this.state;
    if (!stats) {
      return <Loader inline={true} />;
    }

    const data = {
      name: 'traffic',
      columns: ['time', 'in', 'out'],
      points,
    };

    const trafficSeries = new TimeSeries(data);
    return (
      <div ref={measureRef} className="transfers-container">
        <SpeedChart
          trafficSeries={trafficSeries}
          maxDownload={maxDownload}
          maxUpload={maxUpload}
          widgetT={widgetT}
        />
        {!!contentRect.bounds && contentRect.bounds.width >= 300 && (
          <StatColumn stats={stats} widgetT={widgetT} />
        )}
      </div>
    );
  }
}

export default withContentRect('bounds')(
  SocketSubscriptionDecorator<TransferProps>(Transfers)
);
