//import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import IconConstants from 'constants/IconConstants';
import RouterMenuItemLink from 'components/semantic/RouterMenuItemLink';


type PushHandler = () => void;

const onClick = (evt: React.SyntheticEvent, pushNew: PushHandler) => {
  evt.preventDefault();

  pushNew();
};


interface SessionNewButtonProps {
  url: string;
  title: React.ReactNode;
  className?: string;
  pushNew: PushHandler;
}

const SessionNewButton: React.FC<SessionNewButtonProps> = ({ url, title, pushNew, className }) => (
  <RouterMenuItemLink 
    key="button-new" 
    className={ classNames('new', className) }
    icon={ IconConstants.CREATE }
    url={ url } 
    onClick={ (evt: React.SyntheticEvent) => onClick(evt, pushNew) }
  >
    { title }
  </RouterMenuItemLink>
);

/*SessionNewButton.propTypes = {
  // Base URL of the section
  url: PropTypes.string.isRequired,

  // Title of the button
  title: PropTypes.node.isRequired,

  pushNew: PropTypes.func.isRequired,

  className: PropTypes.string,
};*/

export default SessionNewButton;