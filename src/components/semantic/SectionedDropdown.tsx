import { Fragment } from 'react';
import * as React from 'react';
import Dropdown, { DropdownProps } from './Dropdown';

export interface SectionedDropdownProps extends DropdownProps {}

const SectionedDropdown: React.FC<SectionedDropdownProps> = ({ children, ...other }) => {
  // Remove empty sections
  const validChildren = React.Children.toArray(children).filter(
    (child) =>
      React.Children.count((child as React.ReactElement<any>).props.children) > 0,
  );

  return (
    <Dropdown {...other}>
      {React.Children.map(validChildren, (child, index) => {
        return (
          <Fragment key={(child as React.ReactElement<any>).key ?? index}>
            {child}
            {!!validChildren.length && index !== validChildren.length - 1 && (
              <div className="ui divider" />
            )}
          </Fragment>
        );
      })}
    </Dropdown>
  );
};

export default SectionedDropdown;
