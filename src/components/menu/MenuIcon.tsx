//import PropTypes from 'prop-types';
import React from 'react';
import CountLabel, { CountLabelProps } from 'components/CountLabel';
import classNames from 'classnames';
import Icon from 'components/semantic/Icon';
import IconConstants from 'constants/IconConstants';


interface MenuIconProps extends Pick<CountLabelProps, 'urgencies'> {
  className?: string;
  onClick?: (evt: React.SyntheticEvent<any>) => void;
}

// A plain menu icon trigger for dropdowns (with urgency label support)
const MenuIcon: React.FC<MenuIconProps> = ({ urgencies, className, onClick }) => (
  <div className={ classNames('icon-menu', className) }> 
    <Icon
      icon={ IconConstants.MENU }
      //className="link"
      onClick={ onClick }
    />
    <CountLabel 
      urgencies={ urgencies }
      size="mini"
      empty={ true }
      circular={ true }
    />
  </div>
);

/*MenuIcon.propTypes = {
  urgencies: PropTypes.object,
};*/

export { MenuIcon };
