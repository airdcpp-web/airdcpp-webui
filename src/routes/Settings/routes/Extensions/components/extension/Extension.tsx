import * as React from 'react';
import Moment from 'moment';

import ExtensionConstants from 'constants/ExtensionConstants';

import ExtensionIcon from 'routes/Settings/routes/Extensions/components/extension/ExtensionIcon';
import ExtensionActionButtons from 'routes/Settings/routes/Extensions/components/extension/ExtensionActionButtons';

import { compareVersions } from 'compare-versions';

import 'fomantic-ui-css/components/item.min.css';

import * as API from 'types/api';
import * as UI from 'types/ui';

import {
  SocketSubscriptionDecoratorChildProps,
  SocketSubscriptionDecorator,
} from 'decorators/SocketSubscriptionDecorator';
import { errorResponseToString } from 'utils/TypeConvert';
import { DataFetchError } from 'decorators/DataProviderDecorator';

interface VersionProps {
  title: string;
  className?: string;
  packageInfo?: {
    date?: string;
    version: string;
  };
  moduleT: UI.ModuleTranslator;
}

const Version: React.FC<VersionProps> = ({ title, packageInfo, className, moduleT }) => {
  if (!packageInfo) {
    return null;
  }

  const versionDesc = !packageInfo.date
    ? packageInfo.version
    : moduleT.t('datePublished', {
        defaultValue: '{{version}} (published {{date}})',
        replace: {
          version: packageInfo.version,
          date: Moment(packageInfo.date).from(Moment()),
        },
      });

  return (
    <div className={className}>
      {`${title}: `}
      <span>{versionDesc}</span>
    </div>
  );
};

const formatAuthor = (
  moduleT: UI.ModuleTranslator,
  npmPackage?: UI.NpmPackage,
  installedPackage?: API.Extension,
) => {
  let author: string | undefined;
  if (installedPackage && installedPackage.author) {
    author = installedPackage.author;
  }

  if (npmPackage) {
    author = npmPackage.publisher.username;
  }

  if (!author) {
    return null;
  }

  return moduleT.t('byAuthor', {
    defaultValue: 'by {{author}}',
    replace: {
      author,
    },
  });
};

const formatNote = (
  moduleT: UI.ModuleTranslator,
  installedPackage?: API.Extension,
  npmError?: DataFetchError | null,
) => {
  if (installedPackage && !installedPackage.managed) {
    return moduleT.translate('Unmanaged extension');
  }

  if (npmError) {
    return moduleT.t('extensionDirectoryFetchError', {
      defaultValue: 'Failed to fetch information from the extension directory: {{error}}',
      replace: {
        error: errorResponseToString(npmError),
      },
    });
  }

  return moduleT.translate('Non-listed extension');
};

export interface ExtensionProps {
  installedPackage?: API.Extension;
  npmPackage?: UI.NpmPackage;
  npmError?: DataFetchError | null;
  moduleT: UI.ModuleTranslator;
}

interface State {
  installing: boolean;
}
class Extension extends React.PureComponent<
  ExtensionProps & SocketSubscriptionDecoratorChildProps,
  State
> {
  //displayName: 'Extension',

  state: State = {
    installing: false,
  };

  onInstallationStarted = (data: API.ExtensionInstallEvent) => {
    if (data.install_id !== this.props.npmPackage!.name) {
      return;
    }

    this.setState({
      installing: true,
    });
  };

  onInstallationCompleted = (data: API.ExtensionInstallEvent) => {
    if (data.install_id !== this.props.npmPackage!.name) {
      return;
    }

    this.setState({
      installing: false,
    });
  };

  componentDidMount() {
    const { addSocketListener, npmPackage } = this.props;

    if (!!npmPackage) {
      // eslint-disable-next-line max-len
      addSocketListener(
        ExtensionConstants.MODULE_URL,
        ExtensionConstants.INSTALLATION_STARTED,
        this.onInstallationStarted,
      );
      // eslint-disable-next-line max-len
      addSocketListener(
        ExtensionConstants.MODULE_URL,
        ExtensionConstants.INSTALLATION_SUCCEEDED,
        this.onInstallationCompleted,
      );
      // eslint-disable-next-line max-len
      addSocketListener(
        ExtensionConstants.MODULE_URL,
        ExtensionConstants.INSTALLATION_FAILED,
        this.onInstallationCompleted,
      );
    }
  }

  render() {
    const { npmPackage, installedPackage, npmError, moduleT } = this.props;
    const { installing } = this.state;
    const { translate } = moduleT;

    const hasUpdate =
      !!installedPackage &&
      !!npmPackage &&
      compareVersions(installedPackage.version, npmPackage.version) < 0;

    return (
      <div className="item extension">
        <ExtensionIcon installedPackage={installedPackage} hasUpdate={hasUpdate} />
        <div className="content">
          <a className="header">
            {npmPackage ? npmPackage.name : installedPackage!.name}
          </a>
          <div className="meta author">
            {formatAuthor(moduleT, npmPackage, installedPackage)}
          </div>
          <div className="description">
            <span>
              {npmPackage ? npmPackage.description : installedPackage!.description}
            </span>
          </div>
          <div className="extra version">
            <Version
              className="npm"
              title={translate('Latest version')}
              packageInfo={npmPackage}
              moduleT={moduleT}
            />
            <div>{!npmPackage && formatNote(moduleT, installedPackage, npmError)}</div>
            <Version
              className={npmPackage ? (!hasUpdate ? 'latest' : 'outdated') : undefined}
              title={translate('Installed version')}
              packageInfo={installedPackage}
              moduleT={moduleT}
            />
          </div>
          <ExtensionActionButtons
            installedPackage={installedPackage}
            npmPackage={npmPackage}
            installing={installing}
            hasUpdate={hasUpdate}
            moduleT={moduleT}
          />
        </div>
      </div>
    );
  }
}

export default SocketSubscriptionDecorator<ExtensionProps>(Extension);
