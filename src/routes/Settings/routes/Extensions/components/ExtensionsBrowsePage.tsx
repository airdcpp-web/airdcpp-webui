import React from 'react';

import ExtensionActions from 'actions/ExtensionActions';

import ActionButton from 'components/ActionButton';

import EngineStatusMessage from 'routes/Settings/routes/Extensions/components/EngineStatusMessage';
import NpmPackageLayout from 'routes/Settings/routes/Extensions/components/NpmPackageLayout';
import ExtensionsConfigureDialog from 'routes/Settings/routes/Extensions/components/ExtensionsConfigureDialog';


class ExtensionBrowsePage extends React.Component {
  static displayName = 'ExtensionBrowsePage';

  render() {
    return (
      <div>
        <EngineStatusMessage/>
        <div className="table-actions">
          <ActionButton
            action={ ExtensionActions.actions.installUrl }
            moduleId={ ExtensionActions.moduleId }
            className="add"
          />
        </div>
        <NpmPackageLayout/>
        <ExtensionsConfigureDialog/>
      </div>
    );
  }
}

export default ExtensionBrowsePage;