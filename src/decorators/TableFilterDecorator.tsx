import * as React from 'react';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from '@/decorators/DataProviderDecorator';

import * as API from '@/types/api';
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
  onFilterUpdated: (value: string | number | null, method?: API.FilterMethod) => void;
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
    const { store, filter, socket } = props;

    const onFilterUpdated = React.useCallback(
      (pattern: string, method: API.FilterMethod = API.FilterMethod.PARTIAL) => {
        const data = {
          pattern,
          method,
          property: propertyName,
        } as API.TableFilter;

        socket
          .put(`${store.viewUrl}/filter/${filter.id}`, data)
          .catch((error: ErrorResponse) =>
            console.error('Failed to add table filter', error),
          );
      },
      [store.viewUrl, filter.id, socket],
    );

    React.useLayoutEffect(() => {
      return () => {
        if (!store.active) {
          return;
        }

        socket
          .delete(`${store.viewUrl}/filter/${filter.id}`)
          .catch((error: ErrorResponse) =>
            console.error('Failed to delete table filter', error),
          );
      };
    }, [store, filter.id, socket]);

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
