import ShareProfileConstants from 'constants/ShareProfileConstants';

import { Formatter } from 'utils/ValueFormat';

import * as API from 'types/api';

export const formatProfileNameWithSize = (
  profile: API.ShareProfile,
  { formatSize }: Formatter,
) => {
  let str = profile.str;
  if (profile.id !== ShareProfileConstants.HIDDEN_PROFILE_ID) {
    str += ` (${formatSize(profile.size)})`;
  }

  return str;
};

export const profileToEnumValue = (profile: API.ShareProfile, formatter: Formatter) => {
  return {
    id: profile.id,
    name: formatProfileNameWithSize(profile, formatter),
  };
};
