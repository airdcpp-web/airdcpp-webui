import React from 'react';

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
import { ErrorResponse } from 'airdcpp-apisocket';
import { 
  SocketSubscriptionDecoratorChildProps, SocketSubscriptionDecorator
} from 'decorators/SocketSubscriptionDecorator';


const IDLE_CHECK_PERIOD = 3000;
const MAX_EVENTS = 1800; // 30 minutes when transfers are running

const addSpeed = (points: any[], down: number, up: number) => {
  const ret = [
    ...points,
    [
      Date.now(),
      down,
      up,
    ]
  ];

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

interface TransferProps extends MeasuredComponentProps {

}

class Transfers extends React.PureComponent<TransferProps & SocketSubscriptionDecoratorChildProps, State> {
  //displayName: 'Transfers',

  idleInterval: NodeJS.Timer;

  state: State = {
    points: [
      [
        Date.now(),
        0,
        0,
      ]
    ],
    maxDownload: 0,
    maxUpload: 0,
  };

  componentDidMount() {
    this.fetchStats();

    // Add zero values when there is no traffic
    this.idleInterval = setInterval(this.checkIdle, IDLE_CHECK_PERIOD);

    const { addSocketListener } = this.props;
    addSocketListener(TransferConstants.MODULE_URL, TransferConstants.STATISTICS, this.onStatsReceived);
  }

  componentWillUnmount() {
    clearInterval(this.idleInterval);
  }

  checkIdle = () => {
    const { points } = this.state;
    if (points[points.length - 1][0] + IDLE_CHECK_PERIOD - 200 <= Date.now()) {
      this.setState({
        points: addSpeed(points, 0, 0),
      });
    }
  }

  fetchStats = () => {
    SocketService.get(TransferConstants.STATISTICS_URL)
      .then(this.onStatsReceived)
      .catch((error: ErrorResponse) => console.error('Failed to fetch transfer statistics', error.message));
  }

  onStatsReceived = (stats: API.TransferStats) => {
    this.setState({
      points: addSpeed(this.state.points, stats.speed_down, stats.speed_up),
      maxDownload: Math.max(stats.speed_down, this.state.maxDownload),
      maxUpload: Math.max(stats.speed_up, this.state.maxUpload),
      stats: {
        ...this.state.stats,
        ...stats,
      },
    });
  }

  render() {
    const { measureRef, contentRect } = this.props as TransferProps;
    const { points, maxDownload, maxUpload, stats } = this.state as State;
    if (!stats) {
      return <Loader inline={ true }/>;
    }

    const data = {
      name: 'traffic',
      columns: [ 'time', 'in', 'out' ],
      points,
    };

    const trafficSeries = new TimeSeries(data);
    return (
      <div ref={ measureRef } className="transfers-container">
        <SpeedChart
          trafficSeries={ trafficSeries }
          maxDownload={ maxDownload }
          maxUpload={ maxUpload }
        />
        { !!contentRect.bounds && contentRect.bounds.width >= 300 && (
          <StatColumn
            stats={ stats }
          />
        ) }
      </div>
    );
  }
}

export default withContentRect('bounds')(SocketSubscriptionDecorator(Transfers));