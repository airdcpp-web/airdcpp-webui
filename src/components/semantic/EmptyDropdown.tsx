import React from 'react';
import classNames from 'classnames';

import DropdownCaption from './DropdownCaption';


interface EmptyDropdownProps {
  caption: React.ReactNode;
  className?: string;
}

// A component used to emulate a dropdown when there are no items to display
const EmptyDropdown: React.SFC<EmptyDropdownProps> = ({ caption, className }) => {
  const titleClassName = classNames(
    //'caption',
    'empty dropdown',
    className,
  );

  return (
    <div className={ titleClassName }>
      <DropdownCaption>
        { caption }
      </DropdownCaption>
    </div>
  );
};

export default EmptyDropdown
;