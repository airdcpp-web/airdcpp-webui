import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import invariant from 'invariant';

import SocketService from 'services/SocketService';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';

import Loader from 'components/semantic/Loader';
import NotificationActions from 'actions/NotificationActions';
import { APISocket, ErrorResponse, AddListener } from 'airdcpp-apisocket';


export type SocketConnectHandler<DataT, PropsT> = (
  addSocketListener: AddListener, 
  data: {
    refetchData: (keys?: string[]) => void;
    mergeData: (data: Partial<DataT>) => void;
    props: PropsT;
  }
) => void;

export interface DataProviderDecoratorProps<PropsT extends object, DataT extends object> {
  urls: {
    [key: string]: ((props: PropsT, socket: APISocket) => Promise<object | undefined>) | string
  };

  onSocketConnected?: SocketConnectHandler<DataT, PropsT>;

  dataConverters?: {
    [key: string]: (data: any, props: PropsT) => any
  };
  
  loaderText?: React.ReactNode;
  renderOnError?: boolean;
}

export interface DataProviderDecoratorChildProps {
  refetchData: (keys?: string[]) => void;
  dataError?: ErrorResponse;
}

interface State<DataT> {
  data: DataT | null;
  error: ErrorResponse | null;
}

// A decorator that will provide a set of data fetched from the API as props
export default function <PropsT extends object, DataT extends object>(
  Component: React.ComponentType<PropsT & DataProviderDecoratorChildProps & DataT>, 
  settings: DataProviderDecoratorProps<PropsT, DataT>
) {
  const DataProviderDecorator = createReactClass<PropsT, State<DataT>>({
    displayName: 'DataProviderDecorator',
    mixins: [ SocketSubscriptionMixin() ],

    propTypes: {
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
    },

    getInitialState() {
      return {
        data: null,
        error: null,
      };
    },

    componentDidMount() {
      this.mounted = true;
      this.fetchData();
    },

    componentWillUnmount() {
      this.mounted = false;
    },

    onSocketConnected(addSocketListener: AddListener) {
      if (settings.onSocketConnected) {
        settings.onSocketConnected(addSocketListener, {
          refetchData: this.refetchData,
          mergeData: this.mergeData,
          props: this.props,
        });
      }
    },

    // Merge data object into existing data
    mergeData(data: any) {
      this.setState({
        data: Object.assign({}, this.state.data, data)
      });
    },

    refetchData(keys?: string[]) {
      invariant(
        !keys || (Array.isArray(keys) && keys.every(key => !!settings.urls[key])), 
        'Invalid keys supplied to refetchData'
      );
      this.fetchData(keys);
    },

    fetchData(keys?: string[]) {
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
        .then(this.onDataFetched.bind(this, keys), this.onDataFetchFailed);
    },

    // Convert the data array to key-value props
    reduceData(keys: string[], reducedData: any[], data: any, index: number) {
      const { dataConverters } = settings;
      const url = keys[index];
      reducedData[url] = dataConverters && dataConverters[url] ? dataConverters[url](data, this.props) : data;
      return reducedData;
    },

    onDataFetched(keys: string[], values: any[]) {
      if (!this.mounted) {
        return;
      }

      const data = values.reduce(this.reduceData.bind(this, keys), {});

      this.mergeData(data);
    },

    onDataFetchFailed(fetchError: ErrorResponse | Response) {
      if (!this.mounted) {
        return;
      }

      let error: ErrorResponse;
      if (fetchError instanceof Response) {
        // HTTP error
        error = {
          code: fetchError.status,
          message: fetchError.statusText,
          json: {
            message: fetchError.statusText,
          }
        };
      } else {
        // API error
        error = fetchError;
        NotificationActions.apiError('Failed to fetch data', fetchError);
      }

      this.setState({
        error,
      });
    },

    render() {
      const { loaderText, renderOnError } = settings;
      const { data, error } = this.state as State<DataT>;

      if (!data && !error) {
        return !!loaderText && <Loader text={ loaderText }/>;
      }

      if (!!error && !renderOnError) {
        return null;
      }

      return (
        <Component
          refetchData={ this.refetchData }
          dataError={ error }
          { ...this.props }
          { ...data }
        />
      );
    },
  });

  return DataProviderDecorator;
}
