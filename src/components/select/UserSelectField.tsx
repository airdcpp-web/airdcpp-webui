import React, { useEffect } from 'react';

import UserConstants from 'constants/UserConstants';

import OfflineHubMessageDecorator, { OfflineHubMessageDecoratorProps } from 'decorators/OfflineHubMessageDecorator';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { useTranslation } from 'react-i18next';
import { getModuleT, translate } from 'utils/TranslationUtils';
import { RemoteSelectField, RemoteSelectFieldProps } from 'components/select/RemoteSelectField';
import DataProviderDecorator from 'decorators/DataProviderDecorator';
import SocketService from 'services/SocketService';


interface HintedUserFormatterProps {
  option: API.OfflineHintedUser;
}

interface HintedUserFormatterDataProps {
  hintedUser?: Pick<API.HintedUser, 'nicks' | 'hub_names'>;
}

const HintedUserFormatter = DataProviderDecorator<HintedUserFormatterProps, HintedUserFormatterDataProps>(
  ({ hintedUser, option, refetchData }) => {
    useEffect(
      () => {
        refetchData();
      },
      [option]
    );

    if (!hintedUser) {
      return (
        <>
          {option.cid}
        </>
      );
    }

    return (
      <>
        {hintedUser.nicks}
        <span className="description" style={{color: 'gray'}}>
          {` (${hintedUser.hub_names})`}
        </span>
      </>
    );
  },
  {
    urls: {
      hintedUser: async ({ option }, socket): Promise<HintedUserFormatterDataProps['hintedUser']> => {
        try {
          const hintedUser = await socket.post<API.HintedUser | undefined>(
            UserConstants.SEARCH_HINTED_USER_URL, 
            { user: option }
          );

          return hintedUser;
        } catch (e) {
          // ...
        }

        // This generally shouldn't happen as the application should keep the user references available
        // even if the users are offline
        return {
          nicks: option.nicks,
          hub_names: option.hub_url,
        };
      },
    },
  }
);


export interface UserSelectFieldProps extends 
  Omit<RemoteSelectFieldProps<API.HubUser>, 'valueField' | 'url' | 'placeholder'>, 
  Pick<OfflineHubMessageDecoratorProps, 'offlineMessage'> {
    
}

export const UserSelectField: React.FC<UserSelectFieldProps> = ({ offlineMessage, styles, ...other }) => {
  const { t } = useTranslation();
  const formT = getModuleT(t, [UI.Modules.COMMON, UI.SubNamespaces.FORM]);

  const loadOptions = async (value: string): Promise<API.OfflineHintedUser[]> => {
    const options = await SocketService.post<API.HubUser[]>(UserConstants.SEARCH_NICKS_URL, { 
      pattern: value, 
      max_results: 7 
    });

    return options.map(option => ({
      nicks: option.nick,
      cid: option.cid,
      hub_url: option.hub_url,
    }));
  };

  return (
    <OfflineHubMessageDecorator 
      offlineMessage={ offlineMessage }
    >
      <RemoteSelectField<API.OfflineHintedUser>
        placeholder={ translate('Enter nick...', t, UI.Modules.COMMON) }
        valueField="nick"
        descriptionField="hub_name"
        loadOptions={ loadOptions }
        formatOptionLabel={(option) => (
          <HintedUserFormatter
            option={ option }
          />
        )}
        formT={ formT }
        isClearable={ true }
        openMenuOnClick={ false }
        openMenuOnFocus={ false }
        { ...other }
        styles={{
          indicatorsContainer: () => ({
            display: 'none',
          }),
          ...styles,
        }}
      />
    </OfflineHubMessageDecorator>
  );
};
