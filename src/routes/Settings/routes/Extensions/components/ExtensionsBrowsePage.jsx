import React from 'react';

import ExtensionActions from 'actions/ExtensionActions';

import ActionButton from 'components/ActionButton';

import EngineStatusMessage from './EngineStatusMessage';
import NpmPackageLayout from './NpmPackageLayout';
import ExtensionsConfigureDialog from './ExtensionsConfigureDialog';


class ExtensionBrowsePage extends React.Component {
  static displayName = 'ExtensionBrowsePage';

  render() {
    return (
      <div>
        <EngineStatusMessage/>
        <div className="table-actions">
          <ActionButton
            action={ ExtensionActions.installUrl }
            className="add"
          />
        </div>
        <NpmPackageLayout 
          className="package-layout" 
        />
        <ExtensionsConfigureDialog/>
      </div>
    );
  }
}

export default ExtensionBrowsePage;