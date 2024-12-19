import * as React from 'react';
import invariant from 'invariant';
import { merge } from 'lodash';
import { withTranslation, WithTranslation } from 'react-i18next';

import { APISocket, ErrorResponse } from 'airdcpp-apisocket';
import SocketService from 'services/SocketService';

import Loader from 'components/semantic/Loader';
import NotificationActions from 'actions/NotificationActions';
import { ModalRouteCloseContext } from './ModalRouteDecorator';
import {
  SocketSubscriptionDecorator,
  SocketSubscriptionDecoratorChildProps,
  AddSocketListener,
} from './SocketSubscriptionDecorator';
import { translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';

export type SocketConnectHandler<DataT extends object, PropsT extends object> = (
  addSocketListener: AddSocketListener,
  data: {
    refetchData: (keys?: string[]) => void;
    mergeData: (data: Partial<DataT>) => void;
    assignData: (data: Partial<DataT>) => void;
    props: PropsT;
  },
) => void;

export interface DataProviderDecoratorProps {}

export interface DataFetchError /*extends Omit<ErrorResponse, 'code'>*/ {
  code?: number;
  message: string;
  json?: ErrorResponse['json'];
}

export type DataConverter<PropsT extends object> = (
  data: any,
  props: PropsT & WithTranslation,
) => any;

export type DataProviderUrls<PropsT extends object> = {
  [key: string]:
    | ((props: PropsT, socket: APISocket) => Promise<object | undefined>)
    | string;
};

export interface DataProviderDecoratorSettings<
  PropsT extends object,
  DataT extends object,
> {
  // Key-value map of prop names and API urls
  // Value may also be a function which receives the props and SocketService as argument and performs the data fetch
  urls: DataProviderUrls<PropsT>;

  // Called when the socket is connected
  onSocketConnected?: SocketConnectHandler<DataT, PropsT>;

  // Key-value map of prop names and functions
  // Converter functions receives the fetched data as parameter
  dataConverters?: {
    [key: string]: DataConverter<PropsT>;
  };

  // Text to show while loading data (use null to disable spinner)
  loaderText?: React.ReactNode;

  // Should the decorated components handle data fetching failures?
  renderOnError?: boolean;
}

export interface DataProviderDecoratorChildProps {
  socket: APISocket;
  refetchData: (keys?: string[]) => void;
  //dataError: DataError | (Error & { status: undefined; code: undefined }) | null;
  dataError: DataFetchError | null;
}

interface State<DataT extends object> {
  data: DataT | null;
  error: DataFetchError | null;
}

type DataProps<PropsT = UI.EmptyObject> = WithTranslation &
  SocketSubscriptionDecoratorChildProps<PropsT>;

// A decorator that will provide a set of data fetched from the API as props
export default function <PropsT extends object, DataT extends object>(
  Component: React.ComponentType<PropsT & DataProviderDecoratorChildProps & DataT>,
  settings: DataProviderDecoratorSettings<PropsT, DataT>,
) {
  class DataProviderDecorator extends React.Component<
    DataProviderDecoratorProps & DataProps<PropsT> & PropsT,
    State<DataT>
  > {
    //displayName: 'DataProviderDecorator',
    mounted = false;

    state: State<DataT> = {
      data: null,
      error: null,
    };

    componentDidMount() {
      this.mounted = true;
      this.fetchData();

      if (settings.onSocketConnected && SocketService.isConnected()) {
        settings.onSocketConnected(this.props.addSocketListener, {
          refetchData: this.refetchData,
          mergeData: this.mergeData,
          assignData: this.assignData,
          props: this.props,
        });
      }
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    // Recursively merge data object into existing data
    mergeData = (partialData: Partial<DataT>) => {
      this.setState({
        data: merge({}, this.state.data, partialData),
      });
    };

    // Replace existing data properties with new data
    assignData = (partialData: any) => {
      this.setState({
        data: {
          ...this.state.data,
          ...partialData,
        },
      });
    };

    refetchData = (keys?: string[]) => {
      invariant(
        !keys || (Array.isArray(keys) && keys.every((key) => !!settings.urls[key])),
        'Invalid keys supplied to refetchData',
      );
      this.fetchData(keys);
    };

    fetchData = (keys?: string[]) => {
      const { urls } = settings;
      if (!keys) {
        keys = Object.keys(urls);
      }

      const promises = keys.map((key) => {
        const url = urls[key];
        if (typeof url === 'function') {
          try {
            const ret = url(this.props, SocketService);
            return ret;
          } catch (e) {
            // Handle non-async errors
            return Promise.reject(e);
          }
        }

        return SocketService.get(url);
      });

      Promise.all(promises)
        .then(this.onDataFetched.bind(this, keys))
        .catch(this.onDataFetchFailed);
    };

    // Convert the data array to key-value props
    reduceData = (
      keys: string[],
      reducedData: Record<string, any>,
      data: any,
      index: number,
    ) => {
      const { dataConverters } = settings;
      const url = keys[index];
      reducedData[url] =
        dataConverters && dataConverters[url]
          ? dataConverters[url](data, this.props)
          : data;
      return reducedData;
    };

    onDataFetched = (keys: string[], values: any[]) => {
      if (!this.mounted) {
        return;
      }

      const data = values.reduce(this.reduceData.bind(this, keys), {});

      this.assignData(data);
    };

    onDataFetchFailed = (error: ErrorResponse | Error) => {
      if (!this.mounted) {
        return;
      }

      const { t } = this.props;

      NotificationActions.apiError(
        translate('Failed to fetch data', t, UI.Modules.COMMON),
        error,
      );
      this.setState({
        error,
      });
    };

    render() {
      const { loaderText, renderOnError } = settings;
      const { data, error } = this.state;
      const { t } = this.props;

      if (!data && !error) {
        return (
          loaderText !== null && (
            <Loader
              text={loaderText || translate('Loading data...', t, UI.Modules.COMMON)}
            />
          )
        );
      }

      if (!!error && !renderOnError) {
        return (
          <ModalRouteCloseContext.Consumer>
            {(close) => {
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
          refetchData={this.refetchData}
          dataError={error}
          socket={SocketService}
          {...(this.props as any)}
          {...data}
        />
      );
    }
  }

  return withTranslation()(
    SocketSubscriptionDecorator<WithTranslation & PropsT & DataProviderDecoratorProps>(
      DataProviderDecorator,
    ),
  );
}
