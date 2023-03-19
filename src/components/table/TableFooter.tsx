//import PropTypes from 'prop-types';
import * as React from 'react';

import TextFilter, { TextFilterProps } from './TextFilter';
import Icon from 'components/semantic/Icon';
import IconConstants from 'constants/IconConstants';
import { TableFilterDecoratorProps } from 'decorators/TableFilterDecorator';

const CountInfo: React.FC<{ store: any }> = ({ store }) => {
  if (store.totalCount < 0) {
    // Not initialized yet
    return null;
  }

  let ret = store.totalCount;
  if (store.totalCount !== store.rowCount) {
    ret = store.rowCount + '/' + store.totalCount;
  }

  return (
    <div className="count-info">
      <Icon icon={IconConstants.FILTER} />
      {ret}
    </div>
  );
};

export type CustomTableFilter = React.ComponentType<TableFilterDecoratorProps>;

export interface TableFooterProps {
  footerData?: React.ReactNode;
  customFilter?: CustomTableFilter;
  store: any;
  textFilterProps?: TextFilterProps;
  // viewId?: string | number;
}

const TableFooter: React.FC<TableFooterProps> = ({
  store,
  customFilter: CustomFilter,
  footerData,
  textFilterProps,
}) => (
  <div className="table-footer">
    {footerData}
    <div className="filter item">
      {!CustomFilter ? null : <CustomFilter viewUrl={store.viewUrl} />}
      <TextFilter
        viewUrl={store.viewUrl}
        //viewId={ viewId }
        {...textFilterProps}
      />
      <CountInfo store={store} />
    </div>
  </div>
);

/*TableFooter.propTypes = {
  customFilter: PropTypes.node,
  footerData: PropTypes.node,
  store: PropTypes.object.isRequired,
};*/

export default TableFooter;
