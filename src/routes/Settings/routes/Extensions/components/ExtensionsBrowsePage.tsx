import React from 'react';

import ExtensionActions from 'actions/ExtensionActions';

import ActionButton from 'components/ActionButton';

import EngineStatusMessage from 'routes/Settings/routes/Extensions/components/EngineStatusMessage';
import NpmPackageLayout from 'routes/Settings/routes/Extensions/components/NpmPackageLayout';
import ExtensionsConfigureDialog from 'routes/Settings/routes/Extensions/components/ExtensionsConfigureDialog';

import * as UI from 'types/ui';


interface ExtensionBrowsePageProps {
  settingsT: UI.ModuleTranslator;
}

const ExtensionBrowsePage: React.FC<ExtensionBrowsePageProps> = ({ settingsT }) => {
  return (
    <div>
      <EngineStatusMessage
        settingsT={ settingsT }
      />
      <div className="table-actions">
        <ActionButton
          actions={ ExtensionActions }
          actionId="installUrl"
          className="add"
        />
      </div>
      <NpmPackageLayout
        settingsT={ settingsT }
      />
      <ExtensionsConfigureDialog/>
    </div>
  );
};

export default ExtensionBrowsePage;