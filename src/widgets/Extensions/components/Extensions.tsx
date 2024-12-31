import * as React from 'react';

import { ExtensionInfoEntry } from './ExtensionInfoEntry';
import ExtensionConstants from 'constants/ExtensionConstants';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';
import { fetchCorsSafeData } from 'services/HttpService';

import * as API from 'types/api';
import * as UI from 'types/ui';

import 'fomantic-ui-css/components/list.min.css';
import '../style.css';

type NpmPackageLayoutProps = UI.WidgetProps;

interface NpmCatalogItem {
  package: UI.NpmPackage;
}

interface NpmPackageLayoutDataProps extends DataProviderDecoratorChildProps {
  installedPackages: API.Extension[];
  packageCatalog: NpmCatalogItem[];
}

const getItem = (
  npmPackage: UI.NpmPackage,
  moduleT: UI.ModuleTranslator,
  installedPackages: API.Extension[],
) => {
  const installedPackage = installedPackages.find((p) => p.name === npmPackage.name);
  return (
    <ExtensionInfoEntry
      key={npmPackage.name}
      npmPackage={npmPackage}
      installedPackage={installedPackage}
      moduleT={moduleT}
    />
  );
};

const packageDateSort = (a: NpmCatalogItem, b: NpmCatalogItem) => {
  const res = a.package.date.localeCompare(b.package.date);
  if (res === 0) {
    return 0;
  }

  return res > 0 ? -1 : 1;
};

const NpmPackageLayout: React.FC<NpmPackageLayoutProps & NpmPackageLayoutDataProps> = ({
  packageCatalog,
  widgetT,
  installedPackages,
}) => (
  <div className="extension-layout">
    {packageCatalog.length > 0 && (
      <div className="ui divided list">
        {packageCatalog
          .slice()
          .sort(packageDateSort)
          .map((data) => getItem(data.package, widgetT, installedPackages))}
      </div>
    )}
  </div>
);

export default DataProviderDecorator<NpmPackageLayoutProps, NpmPackageLayoutDataProps>(
  NpmPackageLayout,
  {
    urls: {
      installedPackages: ExtensionConstants.EXTENSIONS_URL,
      packageCatalog: () => fetchCorsSafeData(ExtensionConstants.NPM_PACKAGES_URL, true),
    },
    dataConverters: {
      packageCatalog: ({ objects }) => objects,
    },
  },
);
