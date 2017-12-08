import React, { Fragment } from 'react';
import Dropdown from './Dropdown';

const SectionedDropdown = ({ children, ...other }) => {
  return (
    <Dropdown
      { ...other }
    >
      { React.Children.map(children, (child, index) => {
        return (
          <Fragment key={ index }>
            { child }
            { (children.length && index !== children.length - 1) && <div className="ui divider"/> }
          </Fragment>
        );
      }) }
    </Dropdown> 
  );
};

export default SectionedDropdown;