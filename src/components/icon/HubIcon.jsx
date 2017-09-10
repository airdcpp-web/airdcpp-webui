import PropTypes from 'prop-types';
import React from 'react';

import Icon from 'components/semantic/Icon';
import TypeConvert from 'utils/TypeConvert';


const HubIcon = ({ hub, ...other }) => (
  <Icon
    { ...other }
    icon={ TypeConvert.hubOnlineStatusToColor(hub.connect_state.id) + ' sitemap' }
  />
);

HubIcon.propTypes = {
  /**
	 * Hub object
	 */
  hub: PropTypes.object.isRequired,
};

export default HubIcon;