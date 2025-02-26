import * as React from 'react';
import { merge } from 'lodash';

import ShareProfileConstants from '@/constants/ShareProfileConstants';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
  DataProviderDecoratorSettings,
  DataConverter,
} from '@/decorators/DataProviderDecorator';

import * as API from '@/types/api';

interface ShareProfileDecoratorDataProps {
  profiles: API.ShareProfile[];
}

export type ShareProfileDecoratorChildProps = DataProviderDecoratorChildProps &
  ShareProfileDecoratorDataProps;

const ShareProfileDecorator = function <PropsT extends object>(
  Component: React.ComponentType<PropsT & ShareProfileDecoratorChildProps>,
  listHidden: boolean,
  dataProviderDecoratorSettings?: DataProviderDecoratorSettings<
    PropsT,
    ShareProfileDecoratorDataProps
  >,
) {
  const convertProfiles: DataConverter<PropsT> = (data: API.ShareProfile[], { t }) => {
    const profiles = data.filter(
      (p) => listHidden || p.id !== ShareProfileConstants.HIDDEN_PROFILE_ID,
    );

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
        addSocketListener(
          ShareProfileConstants.MODULE_URL,
          ShareProfileConstants.PROFILE_ADDED,
          () => refetchData(),
        );
        addSocketListener(
          ShareProfileConstants.MODULE_URL,
          ShareProfileConstants.PROFILE_UPDATED,
          () => refetchData(),
        );
        addSocketListener(
          ShareProfileConstants.MODULE_URL,
          ShareProfileConstants.PROFILE_REMOVED,
          () => refetchData(),
        );
      },
    } as DataProviderDecoratorSettings<PropsT, ShareProfileDecoratorDataProps>),
  );
};

export default ShareProfileDecorator;
