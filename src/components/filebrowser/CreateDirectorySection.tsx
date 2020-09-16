import PropTypes from 'prop-types';
import React from 'react';

import Accordion from 'components/semantic/Accordion';
import ActionInput, { ActionInputProps } from 'components/semantic/ActionInput';

import * as UI from 'types/ui';

import { TFunction } from 'i18next';
import { translate } from 'utils/TranslationUtils';
import IconConstants from 'constants/IconConstants';
import Icon from 'components/semantic/Icon';


export interface CreateDirectorySectionProps extends Pick<ActionInputProps, 'handleAction'> {
  t: TFunction;
}

export const CreateDirectorySection: React.FC<CreateDirectorySectionProps> = ({ handleAction, t }) => (
  <Accordion>
    <div className="title create-section">
      <Icon icon={ IconConstants.DROPDOWN }/>
      { translate('Create directory', t, UI.Modules.COMMON) }
    </div>

    <div className="content create-section">
      <ActionInput 
        caption={ translate('Create', t, UI.Modules.COMMON) } 
        icon={ IconConstants.CREATE }
        handleAction={ handleAction } 
        placeholder={ translate('Directory name', t, UI.Modules.COMMON) }
      />
    </div>
  </Accordion>
);

CreateDirectorySection.propTypes = {
  // Function to call with the value
  handleAction: PropTypes.func.isRequired
};