import React from 'react';

import ExtensionActions from 'actions/ui/ExtensionActions';
import ExtensionConstants from 'constants/ExtensionConstants';

import ActionButton from 'components/ActionButton';
import ExternalLink from 'components/ExternalLink';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { ActionMenu } from 'components/menu';
import MenuConstants from 'constants/MenuConstants';


export interface ExtensionActionButtonsProps {
  npmPackage?: UI.NpmPackage;
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
      actions={ ExtensionActions.npm }
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
        actions={ ExtensionActions.manage }
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
        actions={ ExtensionActions.manage }
        actionId={ installedPackage.running ? 'stop' : 'start' }
        className="right floated"
        itemData={ installedPackage }
      />
    ) }
    { installedPackage && (
      <ActionButton
        actions={ ExtensionActions.manage }
        actionId="configure"
        className="right floated"
        itemData={ installedPackage }
      />
    ) }
    { installedPackage && (
      <ActionMenu
        actions={ ExtensionActions.manage }
        ids={ [] }
        remoteMenuId={ MenuConstants.EXTENSION }
        itemData={ installedPackage }
        caption={ 'Manage...' }
        button={ true }
      />
    ) }
  </div>
);

export default ExtensionActionButtons;