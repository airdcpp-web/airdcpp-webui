import * as React from 'react';

import Icon, { IconType } from '@/components/semantic/Icon';

import classNames from 'classnames';

interface LayoutHeaderProps {
  className?: string;

  // Size of the header
  size?: string;

  // Icon to display
  icon?: IconType;

  // Component to display on the right side of the header
  rightComponent?: React.ReactNode;

  // Header title
  title: React.ReactNode;

  // Subheader
  subHeader?: React.ReactNode;
}

const LayoutHeader: React.FC<LayoutHeaderProps> = ({
  className,
  icon,
  rightComponent,
  size = 'large',
  title,
  subHeader,
}) => {
  const mainClassName = classNames(
    'header layout',
    { icon: !!icon },
    { sectioned: !!rightComponent },
    className,
  );

  const headerClassName = classNames('ui header', { left: !!rightComponent }, size);

  return (
    <div className={mainClassName}>
      <div className={headerClassName}>
        <Icon size={size} icon={icon} />
        <div className="content">
          {title}
          {!!subHeader && <div className="sub header">{subHeader}</div>}
        </div>
      </div>
      {rightComponent}
    </div>
  );
};

export default LayoutHeader;
