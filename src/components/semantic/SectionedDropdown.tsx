import React, { Fragment } from 'react';
import Dropdown, { DropdownProps } from './Dropdown';


export interface SectionedDropdownProps extends DropdownProps {

}

const SectionedDropdown: React.SFC<SectionedDropdownProps> = ({ children, ...other }) => {
  // Remove empty sections
  const validChildren = React.Children.toArray(children)
    .filter(child => React.Children.count((child as React.ReactElement<any>).props.children) > 0);

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