import { useEffect, useState } from 'react';

import TransferConstants from '@/constants/TransferConstants';

import * as API from '@/types/api';

import { AddSocketListener } from '@/decorators/SocketSubscriptionDecorator';

import { APISocket } from '@/services/SocketService';

const IDLE_APPEND_INTERVAL_MS = 3000;
const DEFAULT_MAX_EVENTS = 1800; // 30 minutes when transfers are running

type Points = Array<number[]>;

interface Series {
  points: Points;
  maxDownload: number;
  maxUpload: number;
}

interface State {
  series: Series;
  stats: API.TransferStats | undefined;
}

const addSpeed = (
  { points, maxDownload: prevMaxDownload, maxUpload: prevMaxUpload }: Series,
  down: number,
  up: number,
  maxEvents: number = DEFAULT_MAX_EVENTS,
) => {
  const ret = [...points, [Date.now(), down, up]];

  if (ret.length > maxEvents) {
    ret.shift();
  }

  return {
    points: ret,
    maxDownload: Math.max(down, prevMaxDownload),
    maxUpload: Math.max(up, prevMaxUpload),
  };
};

const hasEllapsedSinceLastUpdate = (points: Points, ms: number) => {
  return points[points.length - 1][0] + ms <= Date.now();
};

export const useTransferStats = (
  socket: APISocket,
  addSocketListener: AddSocketListener,
  maxEvents: number = DEFAULT_MAX_EVENTS,
) => {
  const [state, setState] = useState<State>({
    series: {
      points: [[Date.now(), 0, 0]],
      maxDownload: 0,
      maxUpload: 0,
    },
    stats: undefined,
  });

  const checkIdle = () => {
    setState((oldState) => {
      if (
        !hasEllapsedSinceLastUpdate(oldState.series.points, IDLE_APPEND_INTERVAL_MS - 200)
      ) {
        return oldState;
      }

      return {
        ...oldState,
        series: addSpeed(oldState.series, 0, 0, maxEvents),
      };
    });
  };

  const onStatsReceived = (newStats: Partial<API.TransferStats>) => {
    setState((prevState) => ({
      series: addSpeed(
        prevState.series,
        newStats.speed_down || prevState.stats?.speed_down || 0,
        newStats.speed_up || prevState.stats?.speed_up || 0,
        maxEvents,
      ),
      stats: {
        ...prevState.stats,
        ...(newStats as API.TransferStats),
      },
    }));
  };

  const onStatsUpdated = (newStats: Partial<API.TransferStats>) => {
    // Ignore updates that are received in bursts
    // The precision of Date.now() has been slightly reduced/randomized,
    // which is possibly causing crashes in the TimeSeries creation at the render method
    // due to unchronological events in the series
    //
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
    //if (!hasEllapsedSinceLastUpdate(points, 100)) {
    //  console.debug(`Transfer widget: burst update ignored`);
    //  return;
    //}

    onStatsReceived(newStats);
  };

  const initStats = async () => {
    try {
      const stats = await socket.get<API.TransferStats>(TransferConstants.STATISTICS_URL);
      onStatsReceived(stats);
    } catch (error) {
      console.error('Failed to fetch transfer statistics', error.message);
    }

    // Add lister
    addSocketListener(
      TransferConstants.MODULE_URL,
      TransferConstants.STATISTICS,
      onStatsUpdated,
    );
  };

  useEffect(() => {
    initStats();

    const idleInterval = window.setInterval(checkIdle, IDLE_APPEND_INTERVAL_MS);
    return () => {
      clearInterval(idleInterval);
    };
  }, []);

  return state;
};
