//import PropTypes from 'prop-types';
import React from 'react';

import TextFilter, { TextFilterProps } from './TextFilter';
import i18next from 'i18next';


const CountInfo: React.FC<{ store: any }> = ({ store }) => {
  let ret = store.totalCount;
  if (store.totalCount !== store.rowCount) {
    ret = store.rowCount + '/' + store.totalCount;
  }

  return (
    <div className="count-info">
      <i className="filter icon"/>
      { ret }
    </div>
  );
};

export interface TableFooterProps {
  footerData?: React.ReactNode;
  customFilter?: React.ReactElement<any>;
  store: any;
  textFilterProps?: Omit<TextFilterProps, 't'>;
  t: i18next.TFunction;
}

const TableFooter: React.FC<TableFooterProps> = ({ store, customFilter, footerData, textFilterProps, t }) => {
  let clonedFilter = null;
  if (!!customFilter) {
    clonedFilter = React.cloneElement(customFilter, { 
      viewUrl: store.viewUrl, 
      t,
    });
  }

  return (
    <div className="table-footer">
      { footerData }
      <div className="filter item">
        { clonedFilter }
        <TextFilter 
          viewUrl={ store.viewUrl }
          t={ t }
          { ...textFilterProps }
        />
        <CountInfo store={ store }/>
      </div>
    </div>
  );
};

/*TableFooter.propTypes = {
  customFilter: PropTypes.node,
  footerData: PropTypes.node,
  store: PropTypes.object.isRequired,
};*/

export default TableFooter;