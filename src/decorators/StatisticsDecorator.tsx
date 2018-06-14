import React from 'react';

import SocketService from 'services/SocketService';
import Message, { MessageDescriptionType } from 'components/semantic/Message';

export interface StatisticsDecoratorProps<DataT> {
  stats?: DataT;
}

export interface StatisticsDecoratorChildProps<DataT> {
  stats: DataT;
}

// Decorator for statistics pages that fetch the content from API
export default function <DataT, PropsT = {}>(
  Component: React.ComponentType<StatisticsDecoratorChildProps<DataT> & PropsT>, 
  fetchUrl: string, 
  unavailableMessage: MessageDescriptionType, 
  fetchIntervalSeconds = 0
) {
  class StatisticsDecorator extends React.Component<StatisticsDecoratorProps<DataT>> {
    state = {
      stats: null
    };

    fetchTimeout: NodeJS.Timer;

    componentDidMount() {
      this.fetchStats();
    }

    componentWillUnmount() {
      clearTimeout(this.fetchTimeout);
    }

    fetchStats = () => {
      SocketService.get(fetchUrl)
        .then(this.onStatsReceived)
        .catch((error: APISocket.Error) => console.error('Failed to fetch stats', error.message));

      if (fetchIntervalSeconds > 0) {
        this.fetchTimeout = setTimeout(this.fetchStats, fetchIntervalSeconds * 1000);
      }
    };

    onStatsReceived = (data: object) => {
      this.setState({ 
        stats: data 
      });
    };

    render() {
      const { stats } = this.state;
      if (stats === null) {
        return null;
      }

      if (this.props.stats) {
        Object.assign(stats, this.props.stats);
      }

      if (stats === undefined) {
        return (
          <Message
            title="Statistics not available"
            description={ unavailableMessage }
          />
        );
      }

      return (
        <Component 
          { ...this.props } 
          stats={ stats }
        />
      );
    }
  }

  return StatisticsDecorator;
}
