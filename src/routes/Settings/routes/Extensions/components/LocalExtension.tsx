import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from '@/decorators/DataProviderDecorator';

import ExtensionConstants from '@/constants/ExtensionConstants';

import Extension from '@/routes/Settings/routes/Extensions/components/extension/Extension';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { fetchCorsSafeData } from '@/services/HttpService';

export interface NpmPackageData {
  name: string;
  description: string;
  version: string;
  _npmUser: {
    name: string;
  };
}

// The npm registry API returns different data/fieldnames for different calls
// so we must do some conversions (the primary data format is the one used by the package search method)
const convertNpmPackage = ({
  name,
  description,
  version,
  _npmUser,
}: NpmPackageData): UI.NpmPackage => {
  return {
    id: name,
    name,
    description,
    version,
    publisher: {
      username: _npmUser.name,
    },
    date: '',
  };
};

interface LocalExtensionProps {
  installedPackage: API.Extension;
  moduleT: UI.ModuleTranslator;
}

interface LocalExtensionDataProps extends DataProviderDecoratorChildProps {
  npmPackage: NpmPackageData;
}

const LocalExtension = DataProviderDecorator<
  LocalExtensionProps,
  LocalExtensionDataProps
>(
  ({ installedPackage, npmPackage, dataError, moduleT }) => (
    <Extension
      key={installedPackage.name}
      installedPackage={installedPackage}
      npmPackage={!!npmPackage ? convertNpmPackage(npmPackage) : undefined}
      npmError={dataError}
      moduleT={moduleT}
    />
  ),
  {
    urls: {
      npmPackage: ({ installedPackage, session }) => {
        if (installedPackage.private || !installedPackage.managed) {
          return Promise.resolve(undefined);
        }

        return fetchCorsSafeData(
          `${ExtensionConstants.NPM_PACKAGE_URL}${installedPackage.name}/latest`,
          session,
        );
      },
    },
    renderOnError: true,
  },
);

export default LocalExtension;
