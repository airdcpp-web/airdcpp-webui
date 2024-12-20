import * as React from 'react';
import Moment from 'moment';

import ExtensionIcon from 'routes/Settings/routes/Extensions/components/extension/ExtensionIcon';

import { compareVersions } from 'compare-versions';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { DataFetchError } from 'decorators/DataProviderDecorator';
import { Link } from 'react-router';

interface VersionProps {
  packageInfo: {
    date: string;
    version: string;
  };
  moduleT: UI.ModuleTranslator;
}

const Version: React.FC<VersionProps> = ({ packageInfo, moduleT }) => {
  const versionDesc = moduleT.t('updatedAgo', {
    defaultValue: 'Updated {{date}}',
    replace: {
      version: packageInfo.version,
      date: Moment(packageInfo.date).from(Moment()),
    },
  });

  return <>{versionDesc}</>;
};

export interface ExtensionProps {
  installedPackage?: API.Extension;
  npmPackage: UI.NpmPackage;
  npmError?: DataFetchError | null;
  moduleT: UI.ModuleTranslator;
}

export const ExtensionInfoEntry: React.FC<ExtensionProps> = ({
  npmPackage,
  installedPackage,
  moduleT,
}) => {
  const hasUpdate =
    !!installedPackage &&
    compareVersions(installedPackage.version, npmPackage.version) < 0;

  return (
    <div className="item extension">
      <ExtensionIcon
        installedPackage={installedPackage}
        hasUpdate={hasUpdate}
        size="big"
      />
      <div className="content">
        <Link
          className="header"
          to={
            !!installedPackage
              ? '/settings/extensions/manage'
              : '/settings/extensions/packages'
          }
        >
          {npmPackage.name}
        </Link>
        <div className="description">
          <Version packageInfo={npmPackage} moduleT={moduleT} />
        </div>
      </div>
    </div>
  );
};
