import PropTypes from 'prop-types';
import React from 'react';

import DataProviderDecorator from 'decorators/DataProviderDecorator';
import SocketService from 'services/SocketService';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { FilterMethod } from 'constants/TableConstants';


export default function (Component, propertyName = 'any') {
  const TableFilterDecorator = React.createClass({
    mixins: [ PureRenderMixin ],
    propTypes: {
      viewUrl: PropTypes.string,
      filter: PropTypes.object.isRequired,
    },

    onFilterUpdated(pattern, method = FilterMethod.PARTIAL) {
      const data = {
        pattern,
        method,
        property: propertyName,
      };

      const { viewUrl, filter } = this.props;
      SocketService.put(viewUrl + '/filter/' + filter.id, data)
        .catch(error => console.error('Failed to add table filter'));
    },

    render() {
      return (
        <Component 
          { ...this.props } 
          onFilterUpdated={ this.onFilterUpdated }
        />
      );
    },
  });

  return DataProviderDecorator(TableFilterDecorator, {
    urls: {
      filter: ({ viewUrl }, socket) => socket.post(viewUrl + '/filter'),
    },
    loaderText: null,
  });
};
