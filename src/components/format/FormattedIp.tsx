import * as React from 'react';

import 'fomantic-ui-css/components/flag.min.css';

import * as API from '@/types/api';
import classNames from 'classnames';

export interface FormattedIpProps {
  item: API.IP;
}

const FormattedIp: React.FC<FormattedIpProps> = ({ item }) => (
  <div className="ip flag">
    <i className={classNames('ui flag', item.country.toLowerCase())} />
    {item.str}
  </div>
);

export default FormattedIp;
