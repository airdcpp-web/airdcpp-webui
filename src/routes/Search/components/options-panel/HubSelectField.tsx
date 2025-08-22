import * as React from 'react';

import tcomb from '@/utils/tcomb-form';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import Checkbox from '@/components/semantic/Checkbox';
import { updateMultiselectValues } from '@/utils/FormUtils';
import HubIcon from '@/components/icon/HubIcon';
import { FormAccordion } from './AccordionField';

interface HubSelectFieldProps {
  value: string[] | null;
  onChange: (hubUrls: string[] | null) => void;
  // ID of the form field label (from tcomb). Used to label the checkbox group.
  labelledById?: string;
}

interface DataProps {
  hubs: API.Hub[];
}

type Props = HubSelectFieldProps & DataProps;

const HubSelectField: React.FC<Props> = ({ hubs, value, onChange, labelledById }) => {
  const onlineHubs = hubs.filter(
    (hub) => hub.connect_state.id === API.HubConnectStateEnum.CONNECTED,
  );
  const selectedUrls =
    !!value && !!value.length ? value : onlineHubs.map((hub) => hub.hub_url);

  const beforeUnchecked = () => {
    if (selectedUrls.length === 1) {
      return false;
    }

    return void 0;
  };

  return (
    <fieldset
      aria-labelledby={labelledById}
      id={labelledById ? `${labelledById}-group` : undefined}
      style={{ border: 0, margin: 0, padding: 0 }}
    >
      {onlineHubs.map((hub) => (
        <div key={hub.id} className="field">
          <Checkbox
            id={`hub-${hub.id}-checkbox`}
            caption={
              <>
                <HubIcon hub={hub} />
                {hub.identity.name}
              </>
            }
            beforeUnchecked={beforeUnchecked}
            checked={selectedUrls.includes(hub.hub_url)}
            onChange={(checked) => {
              const newValue = updateMultiselectValues(
                selectedUrls,
                hub.hub_url,
                checked,
              );
              onChange(newValue.length === onlineHubs.length ? null : newValue);
            }}
            style={{
              maxWidth: '300px',
            }}
          />
        </div>
      ))}
    </fieldset>
  );
};

type TCombTemplate = {
  renderSelect: (locals: UI.FormLocals<API.Hub, string[]>) => React.ReactNode;
  renderLabel: (locals: UI.FormLocals<API.Hub, string[]>) => React.ReactNode;
};

const HubsSelectField: TCombTemplate = {
  renderSelect(locals) {
    const fieldId = locals.attrs.id; // tcomb field id (the label uses htmlFor=fieldId)
    return (
      <FormAccordion locals={locals}>
        <HubSelectField
          onChange={locals.onChange}
          value={locals.value}
          hubs={locals.options}
          labelledById={fieldId}
        />
      </FormAccordion>
    );
  },
  renderLabel(locals) {
    // Keep label rendering handled by the parent/tcomb.
    return null;
  },
};

export default tcomb.form.Form.templates.select.clone(HubsSelectField);
