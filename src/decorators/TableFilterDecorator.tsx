import * as React from 'react';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';
import SocketService from 'services/SocketService';

import * as API from 'types/api';
import { ErrorResponse } from 'airdcpp-apisocket';

interface FilterType {
  id: number;
}

export interface TableFilterDecoratorProps {
  store: any;
}

export interface TableFilterDecoratorDataProps {
  filter: FilterType;
}

export interface TableFilterDecoratorChildProps {
  onFilterUpdated: (value: string | number, method?: API.FilterMethod) => void;
}

export default function <PropsT>(
  Component: React.ComponentType<PropsT & TableFilterDecoratorChildProps>,
  propertyName = 'any',
) {
  type Props = PropsT &
    TableFilterDecoratorProps &
    DataProviderDecoratorChildProps &
    TableFilterDecoratorDataProps;

  const TableFilterDecorator = (props: Props) => {
    const onFilterUpdated = (
      pattern: string,
      method: API.FilterMethod = API.FilterMethod.PARTIAL,
    ) => {
      const data = {
        pattern,
        method,
        property: propertyName,
      } as API.TableFilter;

      const { store, filter } = props;
      SocketService.put(`${store.viewUrl}/filter/${filter.id}`, data).catch(
        (error: ErrorResponse) => console.error('Failed to add table filter', error),
      );
    };

    React.useLayoutEffect(() => {
      return () => {
        const { store, filter } = props;
        if (store.active) {
          SocketService.delete(`${store.viewUrl}/filter/${filter.id}`).catch(
            (error: ErrorResponse) =>
              console.error('Failed to delete table filter', error),
          );
        }
      };
    }, []);

    return <Component {...props} onFilterUpdated={onFilterUpdated} />;
  };

  return DataProviderDecorator<
    PropsT & TableFilterDecoratorProps,
    TableFilterDecoratorDataProps
  >(TableFilterDecorator, {
    urls: {
      filter: ({ store }, socket) => socket.post(`${store.viewUrl}/filter`),
    },
    loaderText: null,
  });
}
