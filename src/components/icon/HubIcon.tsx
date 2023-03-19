//import PropTypes from 'prop-types';
import * as React from 'react';

import Icon, { IconProps } from 'components/semantic/Icon';
import { hubOnlineStatusToColor } from 'utils/TypeConvert';

import * as API from 'types/api';

interface HubIconProps extends IconProps {
  hub: API.Hub;
}

const HubIcon: React.FC<HubIconProps> = ({ hub, ...other }) => (
  <Icon {...other} icon={hubOnlineStatusToColor(hub.connect_state.id) + ' sitemap'} />
);

/*HubIcon.propTypes = {
  // Hub object
  hub: PropTypes.object.isRequired,
};*/

export default HubIcon;
