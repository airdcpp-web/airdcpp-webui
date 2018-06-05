import PropTypes from 'prop-types';
import React from 'react';

import 'semantic-ui/components/flag.min.css';


interface IpFormatterProps {
  item: API.IP;
}

const IpFormatter: React.SFC<IpFormatterProps> = ({ item }) => (
  <div className="ip flag">
    <i className={ 'ui flag ' + item.country.toLowerCase() }/>
    { item.str }
  </div>
);

IpFormatter.propTypes = {
  item: PropTypes.object.isRequired,
};

export default IpFormatter;