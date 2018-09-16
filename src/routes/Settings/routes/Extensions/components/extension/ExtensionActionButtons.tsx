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

const InstallButton: React.SFC<ExtensionActionButtonsProps> = (
  { npmPackage, installedPackage, hasUpdate, installing }
) => {
  if (installedPackage && !hasUpdate) {
    return null;
  }

  return (
    <ActionButton
      action={ hasUpdate ? ExtensionActions.updateNpm : ExtensionActions.installNpm }
      className="right floated primary"
      itemData={ npmPackage }
      loading={ installing }
    />
  );
};

const ExtensionActionButtons: React.SFC<ExtensionActionButtonsProps> = (
  { npmPackage, installedPackage, hasUpdate, installing }
) => (
  <div className="extra buttons">
    { installedPackage && (
      <ActionButton
        action={ ExtensionActions.remove }
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
        Read more
      </ExternalLink> 
    ) }
    { installedPackage && (
      <ActionButton
        action={ installedPackage.running ? ExtensionActions.stop : ExtensionActions.start }
        className="right floated"
        itemData={ installedPackage }
      />
    ) }
    { installedPackage && (
      <ActionButton
        action={ ExtensionActions.configure }
        className="right floated"
        itemData={ installedPackage }
      />
    ) }
  </div>
);

export default ExtensionActionButtons;