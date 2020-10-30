import * as React from 'react';
import classNames from 'classnames';

import DropdownCaption from './DropdownCaption';


interface EmptyDropdownProps {
  caption: React.ReactNode;
  className?: string;
}

// A component used to emulate a dropdown when there are no items to display
const EmptyDropdown: React.FC<EmptyDropdownProps> = ({ caption, className }) => {
  const titleClassName = classNames(
    //'caption',
    'ui empty dropdown',
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