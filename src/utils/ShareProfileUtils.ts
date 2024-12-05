import ShareProfileConstants from 'constants/ShareProfileConstants';

import { formatSize } from 'utils/ValueFormat';

import * as API from 'types/api';
import * as UI from 'types/ui';

export const formatProfileNameWithSize = (
  profile: API.ShareProfile,
  t: UI.TranslateF,
) => {
  let str = profile.str;
  if (profile.id !== ShareProfileConstants.HIDDEN_PROFILE_ID) {
    str += ` (${formatSize(profile.size, t)})`;
  }

  return str;
};

export const profileToEnumValue = (profile: API.ShareProfile, t: UI.TranslateF) => {
  return {
    id: profile.id,
    name: formatProfileNameWithSize(profile, t),
  };
};
