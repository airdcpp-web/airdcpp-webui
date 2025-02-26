import * as React from 'react';

import Icon, { IconProps } from '@/components/semantic/Icon';
import { userOnlineStatusToColor } from '@/utils/TypeConvert';

import * as API from '@/types/api';

const getUserIcon = (flags: API.HubUserFlag[]) => {
  if (flags.includes('ignored')) {
    return 'red ban';
  }

  return userOnlineStatusToColor(flags) + ' user';
};

const flagTitles: Partial<{ [K in API.HubUserFlag]: string }> = {
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
  if (flags.includes('bot')) {
    return 'setting';
  }

  if (flags.includes('op')) {
    return 'yellow privacy';
  }

  if (flags.includes('self')) {
    return 'blue star';
  }

  if (flags.includes('noconnect')) {
    return 'red plug';
  }

  if (flags.includes('passive')) {
    return 'orange protect';
  }

  return null;
};

const getTitle = (flags: API.HubUserFlag[]) => {
  const titles = flags.reduce((reduced, flag) => {
    const title = flagTitles[flag];
    if (!!title) {
      reduced.push(title);
    }

    return reduced;
  }, [] as string[]);

  return titles.toString();
};

interface UserIconProps extends IconProps {
  flags: API.HubUserFlag[];
}

const UserIcon: React.FC<UserIconProps> = ({ flags, ...other }) => (
  <Icon
    {...other}
    icon={getUserIcon(flags)}
    cornerIcon={getCornerIcon(flags)}
    title={getTitle(flags)}
  />
);

export default UserIcon;
