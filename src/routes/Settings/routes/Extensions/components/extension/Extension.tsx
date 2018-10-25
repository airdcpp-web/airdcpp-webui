//import PropTypes from 'prop-types';
import React from 'react';
import Moment from 'moment';

import ExtensionConstants from 'constants/ExtensionConstants';

import ExtensionIcon from 'routes/Settings/routes/Extensions/components/extension/ExtensionIcon';
import ExtensionActionButtons from 'routes/Settings/routes/Extensions/components/extension/ExtensionActionButtons';

//@ts-ignore
import PureRenderMixin from 'react-addons-pure-render-mixin';

import versionCompare from 'compare-versions';

import 'semantic-ui-css/components/item.min.css';

import * as API from 'types/api';
import { ErrorResponse } from 'airdcpp-apisocket';
import { 
  SocketSubscriptionDecoratorChildProps, SocketSubscriptionDecorator
} from 'decorators/SocketSubscriptionDecorator';


interface VersionProps {
  title: string;
  className?: string;
  packageInfo?: {
    date?: number;
    version: string;
  };
}

const Version: React.SFC<VersionProps> = ({ title, packageInfo, className }) => {
  if (!packageInfo) {
    return null;
  }

  const publishDate = packageInfo.date ? ` (published ${Moment(packageInfo.date).from(Moment())})` : '';
  return (
    <div className={ className }>
      { (title ? title + ': ' : '') }
      <span> 
        { packageInfo.version + publishDate }
      </span>
    </div>
  );
};

const formatAuthor = (npmPackage?: NpmPackage, installedPackage?: API.Extension) => {
  if (installedPackage && installedPackage.author) {
    return 'by ' + installedPackage.author;
  }

  if (npmPackage) {
    return 'by ' + npmPackage.publisher.username;
  }

  return null;
};

const formatNote = (installedPackage?: API.Extension, npmError?: ErrorResponse | null) => {
  if (installedPackage && !installedPackage.managed) {
    return 'Unmanaged extension';
  }

  if (npmError) {
    return `Failed to fetch information from the extension directory: ${npmError.message} (code ${npmError.code})`;
  }

  return 'Non-listed extension';
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
    const { npmPackage, installedPackage, npmError } = this.props;
    const { installing } = this.state;

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
            { formatAuthor(npmPackage, installedPackage) }
          </div>
          <div className="description">
            <span>{ npmPackage ? npmPackage.description : installedPackage!.description }</span>
          </div>
          <div className="extra version">
            <Version 
              className="npm"
              title="Latest version" 
              packageInfo={ npmPackage }
            />
            <div>
              { !npmPackage && formatNote(installedPackage, npmError) }
            </div>
            <Version 
              className={ npmPackage ? (!hasUpdate ? 'latest' : 'outdated') : undefined }
              title="Installed version" 
              packageInfo={ installedPackage }
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

export default SocketSubscriptionDecorator(Extension);