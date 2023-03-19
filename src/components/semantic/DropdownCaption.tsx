import * as React from 'react';

import Icon, { IconType } from './Icon';

interface DropdownCaptionProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: IconType;
}

const DropdownCaption: React.FC<DropdownCaptionProps> = ({
  icon,
  children,
  ...other
}) => {
  return (
    <div className="caption" {...other}>
      <Icon icon={icon} />
      {children}
    </div>
  );
};

export default DropdownCaption;
