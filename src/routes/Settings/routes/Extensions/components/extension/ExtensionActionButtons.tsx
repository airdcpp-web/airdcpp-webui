import React from 'react';

import ExtensionActions from 'actions/ExtensionActions';
import ExtensionConstants from 'constants/ExtensionConstants';

import ActionButton from 'components/ActionButton';
import ExternalLink from 'components/ExternalLink';
import { NpmPackage } from 'routes/Settings/routes/Extensions/components/extension/Extension';

import * as API from 'types/api';
import * as UI from 'types/ui';


export interface ExtensionActionButtonsProps {
  npmPackage?: NpmPackage;
  installedPackage?: API.Extension;
  hasUpdate: boolean;
  installing: boolean;
  moduleT: UI.ModuleTranslator;
}


type InstallButtonProps = Omit<ExtensionActionButtonsProps, 'moduleT'>;

const InstallButton: React.FC<InstallButtonProps> = (
  { npmPackage, installedPackage, hasUpdate, installing }
) => {
  if (installedPackage && !hasUpdate) {
    return null;
  }

  return (
    <ActionButton
      actions={ ExtensionActions }
      actionId={ hasUpdate ? 'updateNpm' : 'installNpm' }
      className="right floated primary"
      itemData={ npmPackage }
      loading={ installing }
    />
  );
};

const ExtensionActionButtons: React.FC<ExtensionActionButtonsProps> = (
  { npmPackage, installedPackage, hasUpdate, installing, moduleT }
) => (
  <div className="extra buttons">
    { installedPackage && (
      <ActionButton
        actions={ ExtensionActions }
        actionId="remove"
        className="right floated"
        itemData={ installedPackage }
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
        { moduleT.translate('Read more') }
      </ExternalLink> 
    ) }
    { installedPackage && (
      <ActionButton
        actions={ ExtensionActions }
        actionId={ installedPackage.running ? 'stop' : 'start' }
        className="right floated"
        itemData={ installedPackage }
      />
    ) }
    { installedPackage && (
      <ActionButton
        actions={ ExtensionActions }
        actionId="configure"
        className="right floated"
        itemData={ installedPackage }
      />
    ) }
  </div>
);

export default ExtensionActionButtons;