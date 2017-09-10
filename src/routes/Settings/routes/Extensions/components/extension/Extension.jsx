import PropTypes from 'prop-types';
import React from 'react';
import Moment from 'moment';

import ExtensionConstants from 'constants/ExtensionConstants';

import ExtensionIcon from './ExtensionIcon';
import ExtensionActionButtons from './ExtensionActionButtons';

import PureRenderMixin from 'react-addons-pure-render-mixin';
import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';

import versionCompare from 'compare-versions';

import 'semantic-ui/components/item.min.css';


const Version = ({ title, packageInfo, className }) => {
  if (!packageInfo) {
    return null;
  }

  return (
    <div className={ className }>
      { (title ? title + ': ' : '') }
      <span> 
        { packageInfo.version + (packageInfo.date ? ' (published ' + Moment(packageInfo.date).from(Moment()) + ')' : '') }
      </span>
    </div>
  );
};

const formatAuthor = (npmPackage, installedPackage) => {
  if (installedPackage && installedPackage.author) {
    return 'by ' + installedPackage.author;
  }

  if (npmPackage) {
    return 'by ' + npmPackage.publisher.username;
  }

  return null;
};

const formatNote = (installedPackage, npmError) => {
  if (installedPackage && !installedPackage.managed) {
    return 'Unmanaged extension';
  }

  if (npmError) {
    return `Failed to fetch information from the extension directory: ${npmError.message} (code ${npmError.code})`;
  }

  return 'Non-listed extension';
};


const Extension = React.createClass({
  mixins: [ PureRenderMixin, SocketSubscriptionMixin() ],
  propTypes: {
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
  },

  getInitialState() {
    return {
      installing: false,
    };
  },

  onInstallationStarted(data) {
    if (data.install_id !== this.props.npmPackage.name) {
      return;
    }

    this.setState({
      installing: true,
    });
  },

  onInstallationCompleted(data) {
    if (data.install_id !== this.props.npmPackage.name) {
      return;
    }

    this.setState({
      installing: false,
    });
  },

  onSocketConnected(addSocketListener) {
    if (this.props.npmPackage) {
      addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.INSTALLATION_STARTED, this.onInstallationStarted);
      addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.INSTALLATION_SUCCEEDED, this.onInstallationCompleted);
      addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.INSTALLATION_FAILED, this.onInstallationCompleted);
    }
  },

  render() {
    const { npmPackage, installedPackage, npmError } = this.props;
    const { installing } = this.state;

    const hasUpdate = installedPackage && npmPackage && versionCompare(installedPackage.version, npmPackage.version) < 0;
    return (
      <div className="item extension">
        <ExtensionIcon
          installedPackage={ installedPackage }
          hasUpdate={ hasUpdate }
        />
        <div className="content">
          <a className="header">
            { npmPackage ? npmPackage.name : installedPackage.name }
          </a>
          <div className="meta author">
            { formatAuthor(npmPackage, installedPackage) }
          </div>
          <div className="description">
            <span>{ npmPackage ? npmPackage.description : installedPackage.description }</span>
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
              className={ npmPackage ? (!hasUpdate ? 'latest' : 'outdated') : null }
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
});

export default Extension;