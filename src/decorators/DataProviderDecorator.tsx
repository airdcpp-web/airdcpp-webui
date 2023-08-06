//import PropTypes from 'prop-types';
import * as React from 'react';
import invariant from 'invariant';
import { merge } from 'lodash';

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
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

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

export interface DataFetchError {
  code?: number;
  message: string;
  json?: ErrorResponse['json'];
}

export type DataConverter<PropsT extends object> = (
  data: any,
  props: PropsT & { t: UI.TranslateF },
) => any;

export interface DataProviderDecoratorSettings<
  PropsT extends object,
  DataT extends object,
> {
  urls: {
    [key: string]:
      | ((
          props: PropsT & { params: UI.RouteParams },
          socket: APISocket,
        ) => Promise<object | undefined>)
      | string;
  };

  onSocketConnected?: SocketConnectHandler<DataT, PropsT>;

  dataConverters?: {
    [key: string]: DataConverter<PropsT>;
  };

  loaderText?: React.ReactNode;
  renderOnError?: boolean;
}

export interface DataProviderDecoratorChildProps {
  socket: APISocket;
  refetchData: (keys?: string[]) => void;
  //dataError: DataError | (Error & { status: undefined; code: undefined }) | null;
  dataError: DataFetchError | null;
  t: UI.TranslateF;
  params: UI.RouteParams;
}

type DataProps<PropsT = UI.EmptyObject> = SocketSubscriptionDecoratorChildProps<PropsT>;

// A decorator that will provide a set of data fetched from the API as props
export default function <PropsT extends object, DataT extends object>(
  Component: React.ComponentType<PropsT & DataProviderDecoratorChildProps & DataT>,
  settings: DataProviderDecoratorSettings<PropsT, DataT>,
) {
  const DataProviderDecorator: React.FC<
    DataProviderDecoratorProps & DataProps<PropsT> & PropsT
  > = (props) => {
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

    const { t } = useTranslation();
    const params = useParams();

    const [data, setData] = React.useState<DataT | null>(null);
    const [error, setError] = React.useState<DataFetchError | null>(null);

    /*componentWillUnmount() {
      this.mounted = false;
    }*/

    // Recursively merge data object into existing data
    const mergeData = (partialData: Partial<DataT>) => {
      setData(merge({}, data, partialData));
    };

    // Replace existing data properties with new data
    const assignData = (partialData: any) => {
      setData({
        ...data,
        ...partialData,
      });
    };

    // Convert the data array to key-value props
    const reduceData = (
      keys: string[],
      reducedData: Record<string, any>,
      newData: any,
      index: number,
    ) => {
      const { dataConverters } = settings;
      const url = keys[index];
      reducedData[url] =
        dataConverters && dataConverters[url]
          ? dataConverters[url](newData, { t, ...props })
          : newData;
      return reducedData;
    };

    const onDataFetched = (keys: string[], values: any[]) => {
      //if (!this.mounted) {
      //  return;
      //}

      const newData = values.reduce(reduceData.bind(null, keys), {});
      assignData(newData);
    };

    const onDataFetchFailed = (error: ErrorResponse | Error) => {
      //if (!this.mounted) {
      //  return;
      //}

      // const { t } = props;

      NotificationActions.apiError(
        translate('Failed to fetch data', t, UI.Modules.COMMON),
        error,
      );

      setError(error);
    };

    const fetchData = (keys?: string[]) => {
      const { urls } = settings;
      if (!keys) {
        keys = Object.keys(urls);
      }

      const promises = keys.map((key) => {
        const url = urls[key];
        if (typeof url === 'function') {
          try {
            const ret = url({ ...props, params }, SocketService);
            return ret;
          } catch (e) {
            // Handle non-async errors
            return Promise.reject(e);
          }
        }

        return SocketService.get(url);
      });

      Promise.all(promises).then(onDataFetched.bind(null, keys)).catch(onDataFetchFailed);
    };

    const refetchData = (keys?: string[]) => {
      invariant(
        !keys || (Array.isArray(keys) && keys.every((key) => !!settings.urls[key])),
        'Invalid keys supplied to refetchData',
      );
      fetchData(keys);
    };

    React.useEffect(() => {
      // this.mounted = true;
      // this.fetchData();

      fetchData();
      if (settings.onSocketConnected && SocketService.isConnected()) {
        settings.onSocketConnected(props.addSocketListener, {
          refetchData: refetchData,
          mergeData: mergeData,
          assignData: assignData,
          props: props,
        });
      }
    }, []);

    const { loaderText, renderOnError } = settings;

    if (!data && !error) {
      return loaderText === null ? null : (
        <Loader text={loaderText || translate('Loading data...', t, UI.Modules.COMMON)} />
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
        refetchData={refetchData}
        dataError={error}
        socket={SocketService}
        t={t}
        params={params}
        {...props}
        {...data!}
      />
    );
  };

  return SocketSubscriptionDecorator<PropsT & DataProviderDecoratorProps>(
    DataProviderDecorator,
  );
}
