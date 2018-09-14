import ShareProfileConstants from 'constants/ShareProfileConstants';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import { formatSize } from 'utils/ValueFormat';


interface ShareProfileDecoratorDataProps {
  profiles: API.ShareProfile[];
}

export type ShareProfileDecoratorChildProps = DataProviderDecoratorChildProps & ShareProfileDecoratorDataProps;

const ShareProfileDecorator = function <PropsT extends object>(
  Component: React.ComponentType<PropsT & ShareProfileDecoratorChildProps>, 
  listHidden: boolean, 
  addSize: boolean = true
) {
  const convertProfile = (profile: API.ShareProfile): API.ShareProfile => {
    let name = profile.str;
    if (addSize && profile.id !== ShareProfileConstants.HIDDEN_PROFILE_ID) {
      name += ' (' + formatSize(profile.size) + ')';
    }

    return {
      ...profile,
      name,
    };
  };

  const onProfilesReceived = (data: API.ShareProfile[]) => {
    const profiles: API.ShareProfile[] = [];
    profiles.push(
      ...data
        .filter(p => listHidden || p.id !== ShareProfileConstants.HIDDEN_PROFILE_ID)
        .map(convertProfile)
    );

    return profiles;
  };

  return DataProviderDecorator<PropsT, ShareProfileDecoratorDataProps>(Component, {
    urls: {
      profiles: ShareProfileConstants.PROFILES_URL,
    },
    dataConverters: {
      profiles: onProfilesReceived,
    },
    onSocketConnected: (addSocketListener, { refetchData }) => {
      addSocketListener(ShareProfileConstants.MODULE_URL, ShareProfileConstants.PROFILE_ADDED, () => refetchData());
      addSocketListener(ShareProfileConstants.MODULE_URL, ShareProfileConstants.PROFILE_UPDATED, () => refetchData());
      addSocketListener(ShareProfileConstants.MODULE_URL, ShareProfileConstants.PROFILE_REMOVED, () => refetchData());
    },
  });
};

export default ShareProfileDecorator;
