import * as React from 'react';

import SocketService from 'services/SocketService';
import Message from 'components/semantic/Message';
import { ErrorResponse } from 'airdcpp-apisocket';

import { Translation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';


export interface StatisticsDecoratorProps<DataT> {
  stats?: DataT;
}

export interface StatisticsDecoratorChildProps<DataT> {
  stats: DataT;
}

// Decorator for statistics pages that fetch the content from API
const StatisticsDecorator = function <DataT, PropsT = {}>(
  Component: React.ComponentType<StatisticsDecoratorChildProps<DataT> & PropsT>, 
  fetchUrl: string, 
  unavailableMessage: ((t: UI.TranslateF, props: PropsT) => string) | null, 
  fetchIntervalSeconds: number = 0
) {
  class Decorator extends React.Component<StatisticsDecoratorProps<DataT> & PropsT> {
    state = {
      stats: null
    };

    fetchTimeout: number | undefined;

    componentDidMount() {
      this.fetchStats();
    }

    componentWillUnmount() {
      window.clearTimeout(this.fetchTimeout);
    }

    fetchStats = () => {
      SocketService.get(fetchUrl)
        .then(this.onStatsReceived)
        .catch((error: ErrorResponse) => console.error('Failed to fetch stats', error.message));

      if (fetchIntervalSeconds > 0) {
        this.fetchTimeout = window.setTimeout(this.fetchStats, fetchIntervalSeconds * 1000);
      }
    }

    onStatsReceived = (data: object) => {
      this.setState({ 
        stats: data 
      });
    }

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
          <Translation>
            { t => (
              <Message
                title={ translate('Statistics not available', t, UI.Modules.COMMON) }
                description={ !unavailableMessage ? undefined : unavailableMessage(t, this.props) }
              />
            ) }
          </Translation>
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

  return Decorator;
};

export default StatisticsDecorator;
