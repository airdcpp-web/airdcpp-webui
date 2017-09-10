import React from 'react';
import classNames from 'classnames';

import DropdownCaption from './DropdownCaption';


// A component used to emulate a dropdown when there are no items to display
const EmptyDropdown = ({ caption, className }) => {
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