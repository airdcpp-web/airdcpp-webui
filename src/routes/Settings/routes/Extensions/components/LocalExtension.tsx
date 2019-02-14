import React from 'react';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import ExtensionConstants from 'constants/ExtensionConstants';

import Extension, { NpmPackage } from 'routes/Settings/routes/Extensions/components/extension/Extension';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { toCorsSafeUrl } from 'utils/HttpUtils';


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
const convertNpmPackage = ({ name, description, version, _npmUser }: NpmPackageData) => {
  return {
    name,
    description,
    version,
    publisher: {
      username: _npmUser.name,
    }
  } as NpmPackage;
};


interface LocalExtensionProps {
  installedPackage: API.Extension;
  settingsT: UI.ModuleTranslator;
}

interface LocalExtensionDataProps extends DataProviderDecoratorChildProps {
  npmPackage: NpmPackageData;
}

const LocalExtension = DataProviderDecorator<LocalExtensionProps, LocalExtensionDataProps>(
  ({ installedPackage, npmPackage, dataError, settingsT }) => (
    <Extension 
      key={ installedPackage.name } 
      installedPackage={ installedPackage } 
      npmPackage={ !!npmPackage ? convertNpmPackage(npmPackage) : undefined }
      npmError={ dataError }
      settingsT={ settingsT }
    />
  ), 
  {
    urls: {
      npmPackage: ({ installedPackage }) => {
        if (installedPackage.private || !installedPackage.managed) {
          return Promise.resolve(undefined);
        }

        return $.getJSON(
          toCorsSafeUrl(`${ExtensionConstants.NPM_PACKAGE_URL}${installedPackage.name}/latest`)
        ) as any as Promise<any>;
      },
    },
    renderOnError: true,
  }
);

export default LocalExtension;
