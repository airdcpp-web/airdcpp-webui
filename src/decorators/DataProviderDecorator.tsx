//import PropTypes from 'prop-types';
import React from 'react';
import invariant from 'invariant';

import SocketService from 'services/SocketService';

import Loader from 'components/semantic/Loader';
import NotificationActions from 'actions/NotificationActions';
import { APISocket, ErrorResponse } from 'airdcpp-apisocket';
import { ModalRouteCloseContext } from './ModalRouteDecorator';
import { 
  SocketSubscriptionDecorator, SocketSubscriptionDecoratorChildProps, AddSocketListener 
} from './SocketSubscriptionDecorator';
//import { toApiError } from 'utils/HttpUtils';
import { withTranslation, WithTranslation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';


export type SocketConnectHandler<DataT, PropsT> = (
  addSocketListener: AddSocketListener, 
  data: {
    refetchData: (keys?: string[]) => void;
    mergeData: (data: Partial<DataT>) => void;
    props: PropsT;
  }
) => void;

export interface DataProviderDecoratorProps {

}

export interface DataFetchError /*extends Omit<ErrorResponse, 'code'>*/ {
  code?: number;
  message: string;
  //status?: string;
  json?: ErrorResponse['json'];
}

export type DataConverter<PropsT extends object> = (data: any, props: PropsT & WithTranslation) => any;

export interface DataProviderDecoratorSettings<PropsT extends object, DataT extends object> {
  urls: {
    [key: string]: ((props: PropsT, socket: APISocket) => Promise<object | undefined>) | string
  };

  onSocketConnected?: SocketConnectHandler<DataT, PropsT>;

  dataConverters?: {
    [key: string]: DataConverter<PropsT>
  };
  
  loaderText?: React.ReactNode;
  renderOnError?: boolean;
}

export interface DataProviderDecoratorChildProps {
  refetchData: (keys?: string[]) => void;
  //dataError: DataError | (Error & { status: undefined; code: undefined }) | null;
  dataError: DataFetchError | null;
}

interface State<DataT extends object> {
  data: DataT | null;
  error: DataFetchError | null;
}

type DataProps<PropsT = {}> = WithTranslation & SocketSubscriptionDecoratorChildProps<PropsT>;

// A decorator that will provide a set of data fetched from the API as props
export default function <PropsT extends object, DataT extends object>(
  Component: React.ComponentType<PropsT & DataProviderDecoratorChildProps & DataT>, 
  settings: DataProviderDecoratorSettings<PropsT, DataT>
) {
  class DataProviderDecorator extends React.Component<DataProviderDecoratorProps & DataProps & PropsT, State<DataT>> {
    //displayName: 'DataProviderDecorator',

    /*propTypes: {
      // Key-value map of prop names and API urls
      // Value may also be a function which receives the props and SocketService as argument and performs the data fetch
      urls: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
      ]), // REQUIRED

      // Called when the socket is connected
      // 
      // onSocketConnected(addSocketListener, {
      //   refetchData(),
      //   mergeData(newData),
      //   props,
      // })
      onSocketConnected: PropTypes.func,

      // Key-value map of prop names and functions 
      // Converter functions receives the fetched data as parameter
      dataConverters: PropTypes.object,

      // Text to show while loading data (use null to disable spinner)
      loaderText: PropTypes.node,

      // Should the decorated components handle data fetching failures?
      renderOnError: PropTypes.bool,
    },*/

    mounted: boolean = false;

    state: State<DataT> = {
      data: null,
      error: null,
    };

    componentDidMount() {
      this.mounted = true;
      this.fetchData();

      if (settings.onSocketConnected && SocketService.isConnected()) {
        settings.onSocketConnected(
          this.props.addSocketListener, 
          {
            refetchData: this.refetchData,
            mergeData: this.mergeData,
            props: this.props,
          }
        );
      }
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    // Merge data object into existing data
    mergeData = (data: any) => {
      this.setState({
        data: {
          ...this.state.data, 
          ...data,
        }
      });
    }

    refetchData = (keys?: string[]) => {
      invariant(
        !keys || (Array.isArray(keys) && keys.every(key => !!settings.urls[key])), 
        'Invalid keys supplied to refetchData'
      );
      this.fetchData(keys);
    }

    fetchData = (keys?: string[]) => {
      const { urls } = settings;
      if (!keys) {
        keys = Object.keys(urls);
      }

      const promises = keys.map(key => {
        let url = urls[key];
        if (typeof url === 'function') {
          return url(this.props, SocketService);
        }

        return SocketService.get(url);
      });

      Promise.all(promises)
        .then(this.onDataFetched.bind(this, keys))
        .catch(this.onDataFetchFailed);
    }

    // Convert the data array to key-value props
    reduceData = (keys: string[], reducedData: any[], data: any, index: number) => {
      const { dataConverters } = settings;
      const url = keys[index];
      reducedData[url] = dataConverters && dataConverters[url] ? dataConverters[url](data, this.props) : data;
      return reducedData;
    }

    onDataFetched = (keys: string[], values: any[]) => {
      if (!this.mounted) {
        return;
      }

      const data = values.reduce(this.reduceData.bind(this, keys), {});

      this.mergeData(data);
    }

    onDataFetchFailed = (error: ErrorResponse | Error) => {
      if (!this.mounted) {
        return;
      }

      const { t } = this.props;
      
      NotificationActions.apiError(translate('Failed to fetch data', t, UI.Modules.COMMON), error);
      this.setState({
        error,
      });
    }

    render() {
      const { loaderText, renderOnError } = settings;
      const { data, error } = this.state;
      const { t } = this.props;

      if (!data && !error) {
        return loaderText !== null && (
          <Loader 
            text={ loaderText || translate('Loading data...', t, UI.Modules.COMMON) }
          />
        );
      }

      if (!!error && !renderOnError) {
        return (
          <ModalRouteCloseContext.Consumer>
            { close => {
              if (!!close) {
                close();
              }
              
              return null;
            }}
          </ModalRouteCloseContext.Consumer>
        );
      }

      return (
        <Component
          refetchData={ this.refetchData }
          dataError={ error }
          { ...this.props }
          { ...data }
        />
      );
    }
  }

  return withTranslation()(SocketSubscriptionDecorator<WithTranslation & PropsT & DataProviderDecoratorProps>(
    DataProviderDecorator
  ));
}
