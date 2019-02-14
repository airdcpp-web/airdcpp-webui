//import PropTypes from 'prop-types';
import React from 'react';
import Moment from 'moment';

import ExtensionConstants from 'constants/ExtensionConstants';

import ExtensionIcon from 'routes/Settings/routes/Extensions/components/extension/ExtensionIcon';
import ExtensionActionButtons from 'routes/Settings/routes/Extensions/components/extension/ExtensionActionButtons';

import versionCompare from 'compare-versions';

import 'semantic-ui-css/components/item.min.css';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { ErrorResponse } from 'airdcpp-apisocket';
import { 
  SocketSubscriptionDecoratorChildProps, SocketSubscriptionDecorator
} from 'decorators/SocketSubscriptionDecorator';
import { errorResponseToString } from 'utils/TypeConvert';


interface VersionProps {
  title: string;
  className?: string;
  packageInfo?: {
    date?: number;
    version: string;
  };
  settingsT: UI.ModuleTranslator;
}

const Version: React.FC<VersionProps> = ({ title, packageInfo, className, settingsT }) => {
  if (!packageInfo) {
    return null;
  }

  const versionDesc = !packageInfo.date ? packageInfo.version : settingsT.t(
    'datePublished',
    {
      defaultValue: '{{version}} (published {{date}})',
      replace: {
        version: packageInfo.version,
        date: Moment(packageInfo.date).from(Moment())
      }
    }
  );

  return (
    <div className={ className }>
      { `${title}: ` }
      <span> 
        { versionDesc }
      </span>
    </div>
  );
};

const formatAuthor = (settingsT: UI.ModuleTranslator, npmPackage?: NpmPackage, installedPackage?: API.Extension) => {
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

  return settingsT.t('byAuthor', {
    defaultValue: 'by {{author}}',
    replace: {
      author
    }
  });
};

const formatNote = (
  settingsT: UI.ModuleTranslator, 
  installedPackage?: API.Extension, 
  npmError?: ErrorResponse | null
) => {
  if (installedPackage && !installedPackage.managed) {
    return settingsT.translate('Unmanaged extension');
  }

  if (npmError) {
    return settingsT.t(
      'extensionDirectoryFetchError',
      {
        defaultValue: 'Failed to fetch information from the extension directory: {{error}}',
        replace: {
          error: errorResponseToString(npmError)
        }
      }
    );
  }

  return settingsT.translate('Non-listed extension');
};


export interface NpmPackage {
  name: string;
  description: string;
  version: string;
  publisher: {
    username: string;
  };
}

export interface ExtensionProps {
  installedPackage?: API.Extension;
  npmPackage?: NpmPackage;
  npmError?: ErrorResponse | null;
  settingsT: UI.ModuleTranslator;
}


interface State {
  installing: boolean;
}
class Extension extends React.PureComponent<ExtensionProps & SocketSubscriptionDecoratorChildProps, State> {
  //displayName: 'Extension',

  /*propTypes: {
    npmPackage: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      version: PropTypes.string.isRequired,
      date: PropTypes.string,
      publisher: PropTypes.shape({
        username: PropTypes.string,
      }),
    }),
    installedPackage: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      version: PropTypes.string.isRequired,
      author: PropTypes.string,
    }),
  },*/

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
  }

  onInstallationCompleted = (data: API.ExtensionInstallEvent) => {
    if (data.install_id !== this.props.npmPackage!.name) {
      return;
    }

    this.setState({
      installing: false,
    });
  }

  componentDidMount() {
    const { addSocketListener, npmPackage } = this.props;

    if (!!npmPackage) {
      // tslint:disable-next-line:max-line-length
      addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.INSTALLATION_STARTED, this.onInstallationStarted);
      // tslint:disable-next-line:max-line-length
      addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.INSTALLATION_SUCCEEDED, this.onInstallationCompleted);
      // tslint:disable-next-line:max-line-length
      addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.INSTALLATION_FAILED, this.onInstallationCompleted);
    }
  }

  render() {
    const { npmPackage, installedPackage, npmError, settingsT } = this.props;
    const { installing } = this.state;
    const { translate } = settingsT;

    const hasUpdate = !!installedPackage && !!npmPackage && 
      versionCompare(installedPackage.version, npmPackage.version) < 0;

    return (
      <div className="item extension">
        <ExtensionIcon
          installedPackage={ installedPackage }
          hasUpdate={ hasUpdate }
        />
        <div className="content">
          <a className="header">
            { npmPackage ? npmPackage.name : installedPackage!.name }
          </a>
          <div className="meta author">
            { formatAuthor(settingsT, npmPackage, installedPackage) }
          </div>
          <div className="description">
            <span>{ npmPackage ? npmPackage.description : installedPackage!.description }</span>
          </div>
          <div className="extra version">
            <Version 
              className="npm"
              title={ translate('Latest version') }
              packageInfo={ npmPackage }
              settingsT={ settingsT }
            />
            <div>
              { !npmPackage && formatNote(settingsT, installedPackage, npmError) }
            </div>
            <Version 
              className={ npmPackage ? (!hasUpdate ? 'latest' : 'outdated') : undefined }
              title={ translate('Installed version') } 
              packageInfo={ installedPackage }
              settingsT={ settingsT }
            />
          </div>
          <ExtensionActionButtons
            installedPackage={ installedPackage }
            npmPackage={ npmPackage }
            installing={ installing }
            hasUpdate={ hasUpdate }
          />
        </div>
      </div>
    );
  }
}

export default SocketSubscriptionDecorator<ExtensionProps>(Extension);