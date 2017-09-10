import React from 'react';

import createReactClass from 'create-react-class';

import { TimeSeries } from 'pondjs';

import Loader from 'components/semantic/Loader';
import StatColumn from './StatColumn';
import SpeedChart from './SpeedChart';

import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';
import SocketService from 'services/SocketService';

import TransferConstants from 'constants/TransferConstants';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { withContentRect } from 'react-measure';

import '../style.css';


const IDLE_CHECK_PERIOD = 3000;
const MAX_EVENTS = 1800; // 30 minutes when transfers are running

const addSpeed = (points, down, up) => {
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

const Transfers = withContentRect('bounds')(createReactClass({
  displayName: 'Transfers',
  mixins: [ SocketSubscriptionMixin(), PureRenderMixin ],

  getInitialState() {
    return {
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
  },

  componentDidMount() {
    this.fetchStats();

    // Add zero values when there is no traffic
    this.idleInterval = setInterval(this.checkIdle, IDLE_CHECK_PERIOD);
  },

  componentWillUnmount() {
    clearInterval(this.idleInterval);
  },

  onSocketConnected(addSocketListener) {
    addSocketListener(TransferConstants.MODULE_URL, TransferConstants.STATISTICS, this.onStatsReceived);
  },

  checkIdle() {
    const { points } = this.state;
    if (points[points.length-1][0] + IDLE_CHECK_PERIOD - 200 <= Date.now()) {
      this.setState({
        points: addSpeed(points, 0, 0),
      });
    }
  },

  fetchStats() {
    SocketService.get(TransferConstants.STATISTICS_URL)
      .then(this.onStatsReceived)
      .catch(error => console.error('Failed to fetch transfer statistics', error.message));
  },

  onStatsReceived(stats) {
    stats = Object.assign({}, this.state.stats, stats);

    this.setState({
      points: addSpeed(this.state.points, stats.speed_down, stats.speed_up),
      maxDownload: Math.max(stats.speed_down, this.state.maxDownload),
      maxUpload: Math.max(stats.speed_up, this.state.maxUpload),
      stats,
    });
  },

  render() {
    const { measureRef, contentRect } = this.props;
    const { points, maxDownload, maxUpload, stats } = this.state;
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
        { contentRect.bounds.width >= 300 && (
          <StatColumn
            stats={ stats }
          />
        ) }
      </div>
    );
  },
}));

export default Transfers;