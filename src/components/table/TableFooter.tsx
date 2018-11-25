//import PropTypes from 'prop-types';
import React from 'react';

import TextFilter, { TextFilterProps } from './TextFilter';


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
  textFilterProps?: TextFilterProps;
}

const TableFooter: React.FC<TableFooterProps> = ({ store, customFilter, footerData, textFilterProps }) => {
  let clonedFilter = null;
  if (!!customFilter) {
    clonedFilter = React.cloneElement(customFilter, { 
      viewUrl: store.viewUrl, 
    });
  }

  return (
    <div className="table-footer">
      { footerData }
      <div className="filter item">
        { clonedFilter }
        <TextFilter 
          viewUrl={ store.viewUrl }
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