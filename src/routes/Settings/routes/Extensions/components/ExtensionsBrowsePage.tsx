import React from 'react';

import ExtensionActions from 'actions/ExtensionActions';

import ActionButton from 'components/ActionButton';

import EngineStatusMessage from 'routes/Settings/routes/Extensions/components/EngineStatusMessage';
import NpmPackageLayout from 'routes/Settings/routes/Extensions/components/NpmPackageLayout';
import ExtensionsConfigureDialog from 'routes/Settings/routes/Extensions/components/ExtensionsConfigureDialog';

import * as UI from 'types/ui';


interface ExtensionBrowsePageProps {
  moduleT: UI.ModuleTranslator;
}

const ExtensionBrowsePage: React.FC<ExtensionBrowsePageProps> = ({ moduleT }) => {
  return (
    <div>
      <EngineStatusMessage
        moduleT={ moduleT }
      />
      <div className="table-actions">
        <ActionButton
          actions={ ExtensionActions }
          actionId="installUrl"
          className="add"
        />
      </div>
      <NpmPackageLayout
        moduleT={ moduleT }
      />
      <ExtensionsConfigureDialog/>
    </div>
  );
};

export default ExtensionBrowsePage;