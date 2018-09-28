import PropTypes from 'prop-types';
import React from 'react';

import FilesystemConstants from 'constants/FilesystemConstants';
import { PlatformEnum } from 'constants/SystemConstants';

import LoginStore from 'stores/LoginStore';
import SocketService from 'services/SocketService';
import { loadLocalProperty, saveLocalProperty } from 'utils/BrowserUtils';

import BrowserBar, { SelectedNameFormatter } from 'components/browserbar';
import Message from 'components/semantic/Message';
import Accordion from 'components/semantic/Accordion';
import ActionInput, { ActionInputProps } from 'components/semantic/ActionInput';

import Loader from 'components/semantic/Loader';
import FileItemList, { FileItemListProps } from './FileItemList';

import * as API from 'types/api';

import './style.css';


interface CreateDirectorySectionProps extends Pick<ActionInputProps, 'handleAction'> {

}

const CreateDirectorySection: React.SFC<CreateDirectorySectionProps> = ({ handleAction }) => (
  <Accordion>
    <div className="title create-section">
      <i className="dropdown icon"/>
      Create directory
    </div>

    <div className="content create-section">
      <ActionInput 
        caption="Create" 
        icon="plus" 
        handleAction={ handleAction } 
        placeholder="Directory name"
      />
    </div>
  </Accordion>
);

CreateDirectorySection.propTypes = {
  // Function to call with the value
  handleAction: PropTypes.func.isRequired
};


interface FileBrowserProps extends Pick<FileItemListProps, 'itemIconGetter'> {
  historyId: string;
  initialPath: string;
  onDirectoryChanged: (path: string) => void;
  selectedNameFormatter?: SelectedNameFormatter;
}

interface State {
  currentDirectory: string;
  items: API.FilesystemItem[];
  loading: boolean;
  error: string | null;
}

class FileBrowser extends React.Component<FileBrowserProps, State> {
  static propTypes = {
    // Local storage ID used for saving/loading the last path
    // This will have priority over initialPath
    historyId: PropTypes.string,

    // Initial directory to show
    initialPath: PropTypes.string,

    // Function to call when changing the directory. Receives the path as param.
    onDirectoryChanged: PropTypes.func,

    // Getter for additional content displayed next to file/directory items
    itemIconGetter: PropTypes.func,

    selectedNameFormatter: PropTypes.func,
  };

  static defaultProps: Pick<FileBrowserProps, 'initialPath'> = {
    initialPath: '',
  };

  get pathSeparator() {
    return LoginStore.systemInfo.path_separator;
  }

  get isWindows() {
    return LoginStore.systemInfo.platform === PlatformEnum.WINDOWS;
  }

  initialFetchCompleted: boolean = false;

  constructor(props: FileBrowserProps) {
    super(props);

    let currentDirectory = loadLocalProperty(this.getStorageKey());
    if (!currentDirectory) {
      currentDirectory = props.initialPath.length === 0 ? this.getRootPath() : props.initialPath;
    }

    this.state = {
      currentDirectory,
      items: [],
      loading: true,
      error: null
    };
  }

  getStorageKey = () => {
    if (!this.props.historyId) {
      return undefined;
    }

    return 'browse_' + this.props.historyId;
  }

  componentDidUpdate(prevProps: FileBrowserProps, prevState: State) {
    if (prevState.currentDirectory !== this.state.currentDirectory) {
      this.onDirectoryChanged();
    }
  }

  componentDidMount() {
    // Fire a change event in case something was loaded from localStorage
    this.onDirectoryChanged();
    this.fetchItems(this.state.currentDirectory);
  }

  onDirectoryChanged = () => {
    // Save the location
    saveLocalProperty(this.getStorageKey(), this.state.currentDirectory);

    // Props
    if (this.props.onDirectoryChanged) {
      this.props.onDirectoryChanged(this.state.currentDirectory);
    }
  }

  fetchItems = (path: string) => {
    this.setState({ 
      error: null,
      loading: true
    });

    SocketService.post(FilesystemConstants.LIST_URL, { 
      path: path, 
      directories_only: false 
    })
      .then(this.onFetchSucceed.bind(this, path))
      .catch(this.onFetchFailed);
  }

  onFetchFailed = (error: Error) => {
    if (!this.initialFetchCompleted) {
      // The path doesn't exists, go to root
      this.fetchItems(this.getRootPath());
      return;
    }

    this.setState({ 
      error: error.message,
      loading: false
    });
  }

  onFetchSucceed = (path: string, data: API.FilesystemItem[]) => {
    this.setState({ 
      currentDirectory: path,
      items: data,
      loading: false
    });

    this.initialFetchCompleted = true;
  }

  _appendDirectoryName = (directoryName: string) => {
    return this.state.currentDirectory + directoryName + this.pathSeparator;
  }

  _handleSelect = (directoryName: string) => {
    const nextPath = this._appendDirectoryName(directoryName);

    this.fetchItems(nextPath);
  }

  _createDirectory = (directoryName: string) => {
    this.setState({ 
      error: null
    });

    const newPath = this.state.currentDirectory + directoryName + this.pathSeparator;
    SocketService.post(FilesystemConstants.DIRECTORY_URL, { path: newPath })
      .then(() => this.fetchItems(this.state.currentDirectory))
      .catch((error: Error) => this.setState({ 
        error: error.message
      }));
  }

  getRootPath = () => {
    return this.isWindows ? '' : '/';
  }

  render() {
    if (this.state.loading) {
      return <Loader text="Loading items"/>;
    }

    const { currentDirectory, error, items } = this.state;
    const { selectedNameFormatter, itemIconGetter } = this.props;

    const hasEditAccess = LoginStore.hasAccess(API.AccessEnum.FILESYSTEM_EDIT);
    const rootName = this.isWindows ? 'Computer' : 'Root';
    return (
      <div className="file-browser">
        { !!error && (
          <Message 
            isError={ true } 
            title="Failed to load content" 
            description={ this.state.error }
          /> 
        ) }
        <BrowserBar 
          path={ currentDirectory }
          separator={ this.pathSeparator } 
          rootPath={ this.getRootPath() } 
          rootName={ rootName } 
          itemClickHandler={ this.fetchItems }
          selectedNameFormatter={ selectedNameFormatter }
        />
        <FileItemList 
          items={ items } 
          itemClickHandler={ this._handleSelect }
          itemIconGetter={ itemIconGetter }
        />
        { !!this.state.currentDirectory && hasEditAccess && (
          <CreateDirectorySection handleAction={ this._createDirectory }/>
        ) }
      </div>
    );
  }
}

export default FileBrowser;
