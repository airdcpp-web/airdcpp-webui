import React, { useState } from 'react';

import * as API from 'types/api';
//import * as UI from 'types/ui';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import HubConstants from 'constants/HubConstants';
import Checkbox from 'components/semantic/Checkbox';
import { updateMultiselectValues } from 'utils/FormUtils';


interface HubSelectFieldProps {

}

interface DataProps {
  hubs: API.Hub[];
}


type Props = HubSelectFieldProps & DataProviderDecoratorChildProps & DataProps;

const HubSelectField: React.FC<Props> = ({ hubs }) => {
  const onlineHubs = hubs.filter(hub => hub.connect_state.id === API.HubConnectStateEnum.CONNECTED);
  const [ selectedHubs, setSelectedHubs ] = useState<number[]>(onlineHubs.map(hub => hub.id));
  return (
    <>
      { onlineHubs.map(hub => (
        <div key={ hub.id } className="field">
          <Checkbox
            caption={ hub.identity.name }
            checked={ selectedHubs.indexOf(hub.id) !== -1 }
            onChange={ checked => {
              setSelectedHubs(
                updateMultiselectValues(selectedHubs, hub.id, checked)
              );
            } }
            /*style={{
              maxWidth: '300px',
            }}*/
          />
        </div>
      )) }
    </>
  );
};

const HubSelectFieldDecorated = DataProviderDecorator<HubSelectFieldProps, DataProps>(
  HubSelectField,
  {
    urls: {
      hubs: HubConstants.SESSIONS_URL
    }
  }
);

export { HubSelectFieldDecorated as HubSelectField };
