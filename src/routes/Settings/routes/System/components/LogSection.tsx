import { useCallback, useState } from 'react';
import RemoteSettingForm from '@/routes/Settings/components/RemoteSettingForm';

import { AccordionContent, AccordionTitle } from '@/components/semantic/Accordion';
import { FormFieldChangeHandler, FormFieldSettingHandler } from '@/components/form/Form';

import * as API from '@/types/api';

import '../style.css';

export interface LogSectionProps {
  section: string;
  index: number;
  simple?: boolean;
}

function LogSection({ section, simple, index }: LogSectionProps) {
  const [active, setActive] = useState(false);

  const convertKey = useCallback(
    (optionalSuffix?: string) => {
      const suffix = optionalSuffix ? `_${optionalSuffix}` : '';
      return `log_${section}${suffix}`;
    },
    [section],
  );

  const onSettingsReceived = (settings: API.SettingValueMap) => {
    setActive(!!settings[convertKey()]);
  };

  const onEnableStateChanged: FormFieldChangeHandler = (id, formValue) => {
    setActive(!!formValue[id]);
  };

  const onContentSetting: FormFieldSettingHandler = (id, fieldOptions) => {
    fieldOptions.disabled = !active;
  };

  const TitleFieldKeys = [convertKey()];
  const ContentFieldKeys = [convertKey('file'), convertKey('format')];

  return (
    <div className="log-section">
      <AccordionTitle active={active} id={section} index={index}>
        <RemoteSettingForm
          keys={TitleFieldKeys}
          onFieldChanged={onEnableStateChanged}
          onSettingValuesReceived={onSettingsReceived}
        />
      </AccordionTitle>

      {!simple && (
        <AccordionContent active={active} id={section} index={index}>
          <RemoteSettingForm keys={ContentFieldKeys} onFieldSetting={onContentSetting} />
        </AccordionContent>
      )}
    </div>
  );
}

export default LogSection;
