import PropTypes from 'prop-types';
import React from 'react';

import Icon from 'components/semantic/Icon';

import classNames from 'classnames';


const LayoutHeader = ({ className, icon, component, size, title, subHeader }) => {
  const mainClassName = classNames(
    'header layout',
    { 'icon': icon },
    className,
  );

  const headerClassName = classNames(
    'ui header left',
    size,
  );

  return (
    <div className={ mainClassName }>
      <div className={ headerClassName }>
        <Icon icon={ icon }/>
        <div className="content">
          { title }
          <div className="sub header">
            { subHeader }
          </div>
        </div>
      </div>
      { component }
    </div>
  );
};

LayoutHeader.defaultProps = {
  buttonCaption: 'Close',
  size: 'large',
};

LayoutHeader.propTypes = {
  /**
	 * Header title
	 */
  title: PropTypes.node.isRequired,

  /**
	 * Subheader
	 */
  subHeader: PropTypes.node,

  /**
	 * Icon to display
	 */
  icon: PropTypes.node,

  /**
	 * Component to display on the right side of the header
	 */
  component: PropTypes.node,

  /**
	 * Size of the header
	 */
  size: PropTypes.string,
};

export default LayoutHeader
;