import * as React from 'react';

import TextFilter, { TextFilterProps } from './TextFilter';
import Icon from '@/components/semantic/Icon';
import IconConstants from '@/constants/IconConstants';
import { TableFilterDecoratorProps } from '@/decorators/TableFilterDecorator';

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
  // Elements to append to the table footer
  footerData?: React.ReactNode;

  // Custom filter that will be displayed in addition to regular text filter
  customFilter?: CustomTableFilter;

  store: any;
  textFilterProps?: TextFilterProps;
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
      {!CustomFilter ? null : <CustomFilter store={store} />}
      <TextFilter store={store} {...textFilterProps} />
      <CountInfo store={store} />
    </div>
  </div>
);

export default TableFooter;
