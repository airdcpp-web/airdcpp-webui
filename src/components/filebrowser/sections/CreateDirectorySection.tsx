import * as React from 'react';

import Accordion from '@/components/semantic/Accordion';
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
  <Accordion>
    <label htmlFor="create_directory" className="title create-section">
      <Icon icon={IconConstants.DROPDOWN} />
      {translate('Create directory', t, UI.Modules.COMMON)}
    </label>

    <div className="content create-section">
      <ActionInput
        caption={translate('Create', t, UI.Modules.COMMON)}
        icon={IconConstants.CREATE}
        handleAction={handleAction}
        placeholder={translate('Directory name', t, UI.Modules.COMMON)}
        id="create_directory"
      />
    </div>
  </Accordion>
);
