import React from 'react';

import SocketService from 'services/SocketService';
import Message from 'components/semantic/Message';

// Decorator for statistics pages that fetch the content from API
export default function (Component, fetchUrl, unavailableMessage, fetchIntervalSeconds = 0) {
  class StatisticsDecorator extends React.Component {
    state = {
      stats: null
    };

    componentDidMount() {
      this.fetchStats();
    }

    componentWillUnmount() {
      clearTimeout(this.fetchTimeout);
    }

    fetchStats = () => {
      SocketService.get(fetchUrl)
        .then(this.onStatsReceived)
        .catch(error => console.error('Failed to fetch stats', error.message));

      if (fetchIntervalSeconds > 0) {
        this.fetchTimeout = setTimeout(this.fetchStats, fetchIntervalSeconds * 1000);
      }
    };

    onStatsReceived = (data) => {
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
