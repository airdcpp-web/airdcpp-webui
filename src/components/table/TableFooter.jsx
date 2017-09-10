import PropTypes from 'prop-types';
import React from 'react';

import TextFilter from './TextFilter';


const CountInfo = ({ store }) => {
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

const TableFooter = ({ store, customFilter, footerData }) => {
  let clonedFilter = null;
  if (customFilter) {
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
        />
        <CountInfo store={ store }/>
      </div>
    </div>
  );
};

TableFooter.propTypes = {
  customFilter: PropTypes.node,
  footerData: PropTypes.node,
  store: PropTypes.object.isRequired,
};

export default TableFooter;