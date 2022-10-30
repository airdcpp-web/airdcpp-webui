import { useEffect } from 'react';
import * as React from 'react';

import Button from 'components/semantic/Button';

import * as API from 'types/api';
import * as UI from 'types/ui';

import Popup from 'components/semantic/Popup';
import { SearchOptionsForm, SearchOptionsFormProps, SearchOptions } from './SearchOptionsForm';
import IconConstants from 'constants/IconConstants';
import Icon from 'components/semantic/Icon';
import { RouteComponentProps } from 'react-router';
import HubConstants from 'constants/HubConstants';
import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import { isValueSet } from 'utils/FormUtils';


interface SearchOptionsButtonProps extends 
  Pick<RouteComponentProps, 'location'>, 
  Pick<SearchOptionsFormProps, 'onChange' | 'value'> {

  moduleT: UI.ModuleTranslator;
}


interface DataProps {
  hubs: API.Hub[];
}

type Props = SearchOptionsButtonProps & DataProviderDecoratorChildProps & DataProps;


const removeEmptyProperties = (value: SearchOptions) => {
  const ret = Object
    .keys(value)
    .reduce(
      (reduced, key) => {
        if (Array.isArray(value[key]) ? !!(value[key] as Array<any>).length : !!value[key]) {
          reduced[key] = value[key] as any;
        }

        return reduced;
      },
      {} as SearchOptions
    );

  return ret;
};


const SearchOptionsButton: React.FC<Props> = ({ 
  moduleT, location, onChange, value, hubs
}) => {
  const onValueChanged = (newValue: SearchOptions | null) => {
    if (newValue) {
      const ret = removeEmptyProperties(newValue);
      onChange(!!Object.keys(ret).length ? ret : null);
    } else {
      onChange(null);
    }
  };

  useEffect(
    () => {
      // Remove obsolete hubs from the options
      if (!!value && !!value.hub_urls && !!value.hub_urls.length) {
        const selectedUrls = value.hub_urls;
        const selectedUrlsNew = selectedUrls.filter(url => hubs.find(hub => hub.hub_url === url));
        if (selectedUrlsNew.length !== selectedUrls.length) {
          onValueChanged({
            ...value,
            hub_urls: !!selectedUrlsNew.length ? selectedUrlsNew : null
          });
        }
      }
    },
    [ hubs ]
  );

  const filterCount = !value ? null : Object.keys(value)
    .filter(key => {
      const curValue = value[key];
      return isValueSet(curValue);
    })
    .length;

  return (
    <Popup
      triggerClassName="options" 
      className="options" 
      trigger={(
        <Button 
          caption={ (
            <>
              <Icon icon={ IconConstants.OPTIONS }/>
              { !!filterCount && (
                <span 
                  style={{ 
                    fontWeight: 'bold',
                    marginRight: '3px',
                    color: 'black'
                  }}
                >
                  { `(${filterCount})` }
                </span>
              ) }
              <Icon icon={ IconConstants.EXPAND }/>
            </>
          ) }
        /> 
      )}
      contentUpdateTrigger={ value }
    >
      { hide => (
        <SearchOptionsForm
          moduleT={ moduleT }
          location={ location }
          onChange={ onValueChanged }
          value={ value }
          hubs={ hubs }
        />
      ) }
    </Popup>
  );
};


const SearchOptionsButtonDecorated = DataProviderDecorator<SearchOptionsButtonProps, DataProps>(
  SearchOptionsButton,
  {
    urls: {
      hubs: HubConstants.SESSIONS_URL
    },
    onSocketConnected: (addSocketListener, { refetchData }) => {
      addSocketListener(HubConstants.MODULE_URL, HubConstants.SESSION_CREATED, () => refetchData());
      addSocketListener<Partial<API.Hub>>(
        HubConstants.MODULE_URL, 
        HubConstants.SESSION_UPDATED, 
        hub => {
          if (!!hub.connect_state) { 
            refetchData();
          }
        }
      );
      addSocketListener(HubConstants.MODULE_URL, HubConstants.SESSION_REMOVED, () => refetchData());
    },
    dataConverters: {
      hubs: (hubs: API.Hub[]) => hubs.filter(hub => hub.connect_state.id === API.HubConnectStateEnum.CONNECTED)
    }
  }
);

export { SearchOptionsButtonDecorated as SearchOptionsButton };
