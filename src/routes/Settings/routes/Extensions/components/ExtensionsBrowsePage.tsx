import * as React from 'react';

import {
  ExtensionInstallActionModule,
  ExtensionInstallURLAction,
} from '@/actions/ui/extension/ExtensionInstallActions';

import ActionButton from '@/components/ActionButton';

import EngineStatusMessage from '@/routes/Settings/routes/Extensions/components/EngineStatusMessage';
import NpmPackageLayout from '@/routes/Settings/routes/Extensions/components/NpmPackageLayout';
import ExtensionsConfigureDialog from '@/routes/Settings/routes/Extensions/components/ExtensionsConfigureDialog';

import * as UI from '@/types/ui';

interface ExtensionBrowsePageProps {
  moduleT: UI.ModuleTranslator;
}

const ExtensionBrowsePage: React.FC<ExtensionBrowsePageProps> = ({ moduleT }) => {
  return (
    <>
      <EngineStatusMessage moduleT={moduleT} />
      <div className="table-actions">
        <ActionButton
          action={ExtensionInstallURLAction}
          moduleData={ExtensionInstallActionModule}
          className="add"
        />
      </div>
      <NpmPackageLayout moduleT={moduleT} />
      <ExtensionsConfigureDialog />
    </>
  );
};

export default ExtensionBrowsePage;
