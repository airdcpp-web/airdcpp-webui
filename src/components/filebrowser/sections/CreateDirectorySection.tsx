import * as React from 'react';

import Accordion, {
  AccordionContent,
  AccordionTitle,
} from '@/components/semantic/Accordion';
import ActionInput, { ActionInputProps } from '@/components/semantic/ActionInput';

import * as UI from '@/types/ui';

import { translate } from '@/utils/TranslationUtils';
import IconConstants from '@/constants/IconConstants';
import Icon from '@/components/semantic/Icon';

export interface CreateDirectorySectionProps
  extends Pick<ActionInputProps, 'handleAction'> {
  t: UI.TranslateF;
}

export const CreateDirectorySection: React.FC<CreateDirectorySectionProps> = ({
  handleAction,
  t,
}) => (
  <Accordion className="create-section">
    <AccordionTitle id="create_directory">
      <Icon icon={IconConstants.DROPDOWN} />
      {translate('Create directory', t, UI.Modules.COMMON)}
    </AccordionTitle>

    <AccordionContent id="create_directory">
      <ActionInput
        caption={translate('Create', t, UI.Modules.COMMON)}
        icon={IconConstants.CREATE}
        handleAction={handleAction}
        placeholder={translate('Directory name', t, UI.Modules.COMMON)}
        id="create_directory"
      />
    </AccordionContent>
  </Accordion>
);
