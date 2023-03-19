//import PropTypes from 'prop-types';
import * as React from 'react';

import Icon, { IconType } from 'components/semantic/Icon';

import classNames from 'classnames';

interface LayoutHeaderProps {
  className?: string;
  size?: string;
  icon?: IconType;
  rightComponent?: React.ReactNode;
  title: React.ReactNode;
  subHeader?: React.ReactNode;
}

const LayoutHeader: React.FC<LayoutHeaderProps> = ({
  className,
  icon,
  rightComponent,
  size,
  title,
  subHeader,
}) => {
  const mainClassName = classNames(
    'header layout',
    { icon: !!icon },
    { sectioned: !!rightComponent },
    className
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

LayoutHeader.defaultProps = {
  size: 'large',
};

/*LayoutHeader.propTypes = {
	// Header title
  title: PropTypes.node.isRequired,

	// Subheader
  subHeader: PropTypes.node,

	// Icon to display
  icon: PropTypes.node,

	// Component to display on the right side of the header
  rightComponent: PropTypes.node,

	// Size of the header
  size: PropTypes.string,
};*/

export default LayoutHeader;
