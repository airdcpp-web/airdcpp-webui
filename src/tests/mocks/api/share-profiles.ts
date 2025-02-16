export const ShareProfileDefaultBase = {
  id: 28550432,
  str: 'Default profile (Default)',
};

export const ShareProfileDefault = {
  ...ShareProfileDefaultBase,
  default: true,
  files: 2004,
  name: 'Default profile',
  size: 60682878029,
};

export const ShareProfileHiddenBase = {
  id: 1,
  str: 'Share hidden',
};

export const ShareProfileHidden = {
  ...ShareProfileHiddenBase,
  default: false,
  files: 0,
  name: 'Share hidden',
  size: 0,
};

export const ShareProfile2Base = {
  id: 535,
  str: 'Profile 2',
};

export const ShareProfile2 = {
  ...ShareProfile2Base,
  default: false,
  files: 1848,
  name: 'Profile 2',
  size: 51592666838,
};

export const ShareProfileEmptyBase = {
  id: 265571564,
  str: 'Empty',
};

export const ShareProfileEmpty = {
  ...ShareProfileEmptyBase,
  default: false,
  files: 0,
  name: 'Empty',
  size: 0,
};

export const ShareProfilesListResponse = [
  ShareProfileDefault,
  ShareProfile2,
  ShareProfileEmpty,
  ShareProfileHidden,
];
