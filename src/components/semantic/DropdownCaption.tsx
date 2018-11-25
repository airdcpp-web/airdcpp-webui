import React from 'react';

import Icon, { IconType } from './Icon';


interface DropdownCaptionProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: IconType;
}

const DropdownCaption: React.FC<DropdownCaptionProps> = ({ icon, children }) => {
  return (
    <div className="caption">
      <Icon icon={ icon }/>
      { children }
    </div>
  );
};

export default DropdownCaption;
