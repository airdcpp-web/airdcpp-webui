import React from 'react';

import FileBrowserLayout from 'components/filebrowser/FileBrowserLayout';
import FilesystemConstants from 'constants/FilesystemConstants';

import LoginStore from 'stores/LoginStore';


interface DownloadFileBrowserProps {
  downloadHandler: (path: string) => void;
  history: string[];
}

class DownloadFileBrowser extends React.Component<DownloadFileBrowserProps> {
  onDirectoryChanged = (path: string) => {
    this.setState({ currentPath: path });
  }

  selectedNameFormatter = (caption: React.ReactNode, token: string) => {
    if (token.length === 0) {
      // Drive listing on Windows isn't a good target
      return caption;
    }

    const formatedCaption = (
      <div className="download-handler" onClick={ () => this.props.downloadHandler(this.state.currentPath) }>
        <i className="green download link icon"/>
        <a>{ caption }</a>
      </div>
    );

    return formatedCaption;
  }

  itemIconGetter = ({ name, type }: API.FilesystemItem) => {
    if (type.id === 'file') {
      return null;
    }

    const separator = LoginStore.systemInfo.path_separator;
    return (
      <i 
        className="green download link icon"
        onClick={ () => this.props.downloadHandler(this.state.currentPath + name + separator) }
      />
    );
  }

  getInitialPath = () => {
    const { history } = this.props;
    return history.length > 0 ? history[history.length - 1] : '';
  }

  state = {
    currentPath: this.getInitialPath(),
  };

  render() {
    return (
      <FileBrowserLayout 
        initialPath={ this.getInitialPath() } 
        selectedNameFormatter={ this.selectedNameFormatter }
        onDirectoryChanged={ this.onDirectoryChanged }
        historyId={ FilesystemConstants.LOCATION_DOWNLOAD }
        itemIconGetter={ this.itemIconGetter }
      />
    );
  }
}

export default DownloadFileBrowser;