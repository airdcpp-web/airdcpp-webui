//import PropTypes from 'prop-types';
import React from 'react';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import SocketService from 'services/SocketService';

import * as API from 'types/api';


interface FilterType {
  id: number;
}

export interface TableFilterDecoratorProps {
  viewUrl: string;
}

export interface TableFilterDecoratorDataProps {
  filter: FilterType;
}

export interface TableFilterDecoratorChildProps {
  onFilterUpdated: (value: string | number, method?: API.FilterMethod) => void;
}

export default function <PropsT>(
  Component: React.ComponentType<PropsT & TableFilterDecoratorChildProps>, 
  propertyName: string = 'any'
) {
  type Props = PropsT & TableFilterDecoratorProps & DataProviderDecoratorChildProps & TableFilterDecoratorDataProps;
  class TableFilterDecorator extends React.PureComponent<Props> {
    //static propTypes = {
    //  viewUrl: PropTypes.string.isRequired,
    //  filter: PropTypes.object.isRequired,
    //};

    onFilterUpdated = (pattern: string, method: API.FilterMethod = API.FilterMethod.PARTIAL) => {
      const data = {
        pattern,
        method,
        property: propertyName,
      } as API.TableFilter;

      const { viewUrl, filter } = this.props;
      SocketService.put(viewUrl + '/filter/' + filter.id, data)
        .catch((error: APISocket.Error) => console.error('Failed to add table filter'));
    }

    render() {
      return (
        <Component 
          { ...this.props } 
          onFilterUpdated={ this.onFilterUpdated }
        />
      );
    }
  }

  return DataProviderDecorator<PropsT & TableFilterDecoratorProps, TableFilterDecoratorDataProps>(
    TableFilterDecorator, 
    {
      urls: {
        filter: ({ viewUrl }, socket) => socket.post(viewUrl + '/filter'),
      },
      loaderText: null,
    }
  );
}
