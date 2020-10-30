//import PropTypes from 'prop-types';
import * as React from 'react';

import Icon, { IconProps } from 'components/semantic/Icon';
import { userOnlineStatusToColor } from 'utils/TypeConvert';

import * as API from 'types/api';


const getUserIcon = (flags: API.HubUserFlag[]) => {
  if (flags.indexOf('ignored') > -1) {
    return 'red ban';
  }

  return userOnlineStatusToColor(flags) + ' user';
};

const flagTitles: Partial<{ [K in API.HubUserFlag]: string; }> = {
  bot: 'Bot',
  op: 'Operator',
  self: 'Me',
  noconnect: 'No connectivity',
  passive: 'Passive connectivity',
  offline: 'Offline',
  away: 'Away',
  ignored: 'Messages ignored',
};

const getCornerIcon = (flags: API.HubUserFlag[]) => {
  if (flags.indexOf('bot') > -1) {
    return 'setting';
  }

  if (flags.indexOf('op') > -1) {
    return 'yellow privacy';
  }

  if (flags.indexOf('self') > -1) {
    return 'blue star';
  }

  if (flags.indexOf('noconnect') > -1) {
    return 'red plug';
  }

  if (flags.indexOf('passive') > -1) {
    return 'orange protect';
  }

  return null;
};

const getTitle = (flags: API.HubUserFlag[]) => {
  const titles = flags.reduce(
    (reduced, flag) => {
      const title = flagTitles[flag];
      if (!!title) {
        reduced.push(title);
      }

      return reduced;
    }, 
    [] as string[]
  );

  return titles.toString();
};

interface UserIconProps extends IconProps {
  flags: API.HubUserFlag[];
}

const UserIcon: React.FC<UserIconProps> = ({ flags, ...other }) => (
  <Icon
    { ...other }
    icon={ getUserIcon(flags) }
    cornerIcon={ getCornerIcon(flags) }
    title={ getTitle(flags) }
  />
);

/*UserIcon.propTypes = {
  // User flag array
  flags: PropTypes.array.isRequired,
};*/

export default UserIcon;