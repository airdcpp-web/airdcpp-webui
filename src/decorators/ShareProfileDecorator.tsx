import * as React from 'react';
import { merge } from 'lodash';

import ShareProfileConstants from 'constants/ShareProfileConstants';

import DataProviderDecorator, { 
  DataProviderDecoratorChildProps, DataProviderDecoratorSettings, DataConverter 
} from 'decorators/DataProviderDecorator';

import { formatSize } from 'utils/ValueFormat';

import * as API from 'types/api';
import * as UI from 'types/ui';


interface ShareProfileDecoratorDataProps {
  profiles: API.ShareProfile[];
}

export const profileToEnumValue = (profile: API.ShareProfile) => {
  return {
    id: profile.id,
    name: profile.str,
  };
};

export type ShareProfileDecoratorChildProps = DataProviderDecoratorChildProps & ShareProfileDecoratorDataProps;

const ShareProfileDecorator = function <PropsT extends object>(
  Component: React.ComponentType<PropsT & ShareProfileDecoratorChildProps>, 
  listHidden: boolean, 
  dataProviderDecoratorSettings?: DataProviderDecoratorSettings<PropsT, ShareProfileDecoratorDataProps>,
  addSize: boolean = true
) {
  const convertProfile = (profile: API.ShareProfile, t: UI.TranslateF): API.ShareProfile => {
    let str = profile.str;
    if (addSize && profile.id !== ShareProfileConstants.HIDDEN_PROFILE_ID) {
      str += ` (${formatSize(profile.size, t)})`;
    }

    return {
      ...profile,
      str,
    };
  };

  const convertProfiles: DataConverter<PropsT> = (data: API.ShareProfile[], { t }) => {
    const profiles = data
        .filter(p => listHidden || p.id !== ShareProfileConstants.HIDDEN_PROFILE_ID)
        .map(p => convertProfile(p, t));

    return profiles;
  };

  return DataProviderDecorator<PropsT, ShareProfileDecoratorDataProps>(
    Component, 
    merge(dataProviderDecoratorSettings, {
      urls: {
        profiles: ShareProfileConstants.PROFILES_URL,
      },
      dataConverters: {
        profiles: convertProfiles,
      },
      onSocketConnected: (addSocketListener, { refetchData }) => {
        addSocketListener(ShareProfileConstants.MODULE_URL, ShareProfileConstants.PROFILE_ADDED, () => refetchData());
        addSocketListener(ShareProfileConstants.MODULE_URL, ShareProfileConstants.PROFILE_UPDATED, () => refetchData());
        addSocketListener(ShareProfileConstants.MODULE_URL, ShareProfileConstants.PROFILE_REMOVED, () => refetchData());
      },
    } as DataProviderDecoratorSettings<PropsT, ShareProfileDecoratorDataProps>)
  );
};

export default ShareProfileDecorator;
