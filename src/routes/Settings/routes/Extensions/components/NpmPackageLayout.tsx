import * as React from 'react';

import Extension from 'routes/Settings/routes/Extensions/components/extension/Extension';
import ExtensionConstants from 'constants/ExtensionConstants';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import 'fomantic-ui-css/components/item.min.css';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { fetchCorsSafeData } from 'services/HttpService';


interface NpmPackageLayoutProps {
  moduleT: UI.ModuleTranslator;
}

interface NpmCatalogItem {
  package: UI.NpmPackage;
}

interface NpmPackageLayoutDataProps extends DataProviderDecoratorChildProps {
  installedPackages: API.Extension[];
  packageCatalog: NpmCatalogItem[];
}

const getItem = (npmPackage: UI.NpmPackage, moduleT: UI.ModuleTranslator, installedPackages: API.Extension[]) => {
  const installedPackage = installedPackages.find(p => p.name === npmPackage.name);
  return (
    <Extension 
      key={ npmPackage.name } 
      npmPackage={ npmPackage } 
      installedPackage={ installedPackage }
      moduleT={ moduleT }
    />
  );
};

const NpmPackageLayout: React.FC<NpmPackageLayoutProps & NpmPackageLayoutDataProps> = ({
  packageCatalog, moduleT, installedPackages
}) => (
  <div className="extension-layout">
    <div className="ui divider"/>
    { packageCatalog.length > 0 && (
      <div className="ui divided items">
        { packageCatalog.map(data => getItem(data.package, moduleT, installedPackages)) }
      </div>
    ) }
  </div>
);

export default DataProviderDecorator<NpmPackageLayoutProps, NpmPackageLayoutDataProps>(NpmPackageLayout, {
  urls: {
    installedPackages: ExtensionConstants.EXTENSIONS_URL,
    packageCatalog: () => fetchCorsSafeData(ExtensionConstants.NPM_PACKAGES_URL, true),
  },
  dataConverters: {
    packageCatalog: ({ objects }) => objects,
  },
  onSocketConnected: (addSocketListener, { refetchData }) => {
    const refetchInstalled = () => refetchData([ 'installedPackages' ]);

    addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.ADDED, refetchInstalled);
    addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.REMOVED, refetchInstalled);
    addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.UPDATED, refetchInstalled);
  },
});
