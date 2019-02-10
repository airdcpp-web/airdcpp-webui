import React from 'react';

import ExtensionActions from 'actions/ExtensionActions';
import ExtensionConstants from 'constants/ExtensionConstants';

import ActionButton from 'components/ActionButton';
import ExternalLink from 'components/ExternalLink';
import { NpmPackage } from 'routes/Settings/routes/Extensions/components/extension/Extension';

import * as API from 'types/api';


export interface ExtensionActionButtonsProps {
  npmPackage?: NpmPackage;
  installedPackage?: API.Extension;
  hasUpdate: boolean;
  installing: boolean;
}

const InstallButton: React.FC<ExtensionActionButtonsProps> = (
  { npmPackage, installedPackage, hasUpdate, installing }
) => {
  if (installedPackage && !hasUpdate) {
    return null;
  }

  return (
    <ActionButton
      action={ hasUpdate ? ExtensionActions.actions.updateNpm : ExtensionActions.actions.installNpm }
      className="right floated primary"
      itemData={ npmPackage }
      loading={ installing }
      moduleId={ ExtensionActions.id }
    />
  );
};

const ExtensionActionButtons: React.FC<ExtensionActionButtonsProps> = (
  { npmPackage, installedPackage, hasUpdate, installing }
) => (
  <div className="extra buttons">
    { installedPackage && (
      <ActionButton
        action={ ExtensionActions.actions.remove }
        className="right floated"
        itemData={ installedPackage }
        moduleId={ ExtensionActions.id }
      />
    ) }
    { npmPackage && (
      <InstallButton
        npmPackage={ npmPackage }
        installedPackage={ installedPackage }
        hasUpdate={ hasUpdate }
        installing={ installing }
      />
    ) }
    { npmPackage && (
      <ExternalLink className="ui right floated button" url={ ExtensionConstants.NPM_HOMEPAGE_URL + npmPackage.name }>
        Read more
      </ExternalLink> 
    ) }
    { installedPackage && (
      <ActionButton
        action={ installedPackage.running ? ExtensionActions.actions.stop : ExtensionActions.actions.start }
        className="right floated"
        itemData={ installedPackage }
        moduleId={ ExtensionActions.id }
      />
    ) }
    { installedPackage && (
      <ActionButton
        action={ ExtensionActions.actions.configure }
        className="right floated"
        itemData={ installedPackage }
        moduleId={ ExtensionActions.id }
      />
    ) }
  </div>
);

export default ExtensionActionButtons;