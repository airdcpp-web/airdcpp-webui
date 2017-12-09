import React, { Fragment } from 'react';
import Dropdown from './Dropdown';

const SectionedDropdown = ({ children, ...other }) => {
  // Remove empty sections
  const validChildren = React.Children.toArray(children)
    .filter(child => React.Children.count(child.props.children) > 0);

  return (
    <Dropdown
      { ...other }
    >
      { React.Children.map(validChildren, (child, index) => {
        return (
          <Fragment key={ index }>
            { child }
            { (validChildren.length && index !== validChildren.length - 1) && <div className="ui divider"/> }
          </Fragment>
        );
      }) }
    </Dropdown> 
  );
};

export default SectionedDropdown;