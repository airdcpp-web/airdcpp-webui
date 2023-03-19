import * as React from 'react';
import t from 'utils/tcomb-form';

import * as API from 'types/api';
import * as UI from 'types/ui';

import Checkbox from 'components/semantic/Checkbox';
import { updateMultiselectValues } from 'utils/FormUtils';
import HubIcon from 'components/icon/HubIcon';
import { FormAccordion } from './AccordionField';

interface HubSelectFieldProps {
  value: string[] | null;
  onChange: (hubUrls: string[] | null) => void;
}

interface DataProps {
  hubs: API.Hub[];
}

type Props = HubSelectFieldProps & DataProps;

const HubSelectField: React.FC<Props> = ({ hubs, value, onChange }) => {
  const onlineHubs = hubs.filter(
    (hub) => hub.connect_state.id === API.HubConnectStateEnum.CONNECTED
  );
  const selectedUrls =
    !!value && !!value.length ? value : onlineHubs.map((hub) => hub.hub_url);

  const beforeUnchecked = () => {
    if (selectedUrls.length === 1) {
      return false;
    }

    return;
  };

  return (
    <>
      {onlineHubs.map((hub) => (
        <div key={hub.id} className="field">
          <Checkbox
            caption={
              <>
                <HubIcon hub={hub} />
                {hub.identity.name}
              </>
            }
            beforeUnchecked={beforeUnchecked}
            checked={selectedUrls.indexOf(hub.hub_url) !== -1}
            onChange={(checked) => {
              const newValue = updateMultiselectValues(
                selectedUrls,
                hub.hub_url,
                checked
              );
              onChange(newValue.length === onlineHubs.length ? null : newValue);
            }}
            style={{
              maxWidth: '300px',
            }}
          />
        </div>
      ))}
    </>
  );
};

type TCombTemplate = {
  renderSelect: (locals: UI.FormLocals<API.Hub, string[]>) => React.ReactNode;
  renderLabel: (locals: UI.FormLocals<API.Hub, string[]>) => React.ReactNode;
};

const HubsSelectField: TCombTemplate = {
  renderSelect(locals) {
    return (
      <FormAccordion locals={locals}>
        <HubSelectField
          onChange={locals.onChange}
          value={locals.value}
          hubs={locals.options}
        />
      </FormAccordion>
    );
  },
  renderLabel(locals) {
    return null;
  },
};

export default t.form.Form.templates.select.clone(HubsSelectField);
