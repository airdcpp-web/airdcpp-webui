//import PropTypes from 'prop-types';
import React from 'react';

import TextFilter, { TextFilterProps } from './TextFilter';
import Icon from 'components/semantic/Icon';
import IconConstants from 'constants/IconConstants';


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
      <Icon icon={ IconConstants.FILTER }/>
      { ret }
    </div>
  );
};

export interface TableFooterProps {
  footerData?: React.ReactNode;
  customFilter?: React.ReactElement<any>;
  store: any;
  textFilterProps?: TextFilterProps;
  viewId?: string;
}

const TableFooter: React.FC<TableFooterProps> = (
  { store, customFilter, footerData, textFilterProps }
) => {
  let clonedFilter = null;
  if (!!customFilter) {
    clonedFilter = React.cloneElement(customFilter, { 
      viewUrl: store.viewUrl,
      //viewId
    });
  }

  return (
    <div className="table-footer">
      { footerData }
      <div className="filter item">
        { clonedFilter }
        <TextFilter 
          viewUrl={ store.viewUrl }
          //viewId={ viewId }
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