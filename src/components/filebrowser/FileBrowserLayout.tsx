import PropTypes from 'prop-types';
import React from 'react';

import FilesystemConstants from 'constants/FilesystemConstants';

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
import * as UI from 'types/ui';

import './style.css';
import { TFunction } from 'i18next';
import { translate } from 'utils/TranslationUtils';
import { withTranslation, WithTranslation } from 'react-i18next';
import IconConstants from 'constants/IconConstants';
import Icon from 'components/semantic/Icon';


interface CreateDirectorySectionProps extends Pick<ActionInputProps, 'handleAction'> {
  t: TFunction;
}

const CreateDirectorySection: React.FC<CreateDirectorySectionProps> = ({ handleAction, t }) => (
  <Accordion>
    <div className="title create-section">
      <Icon icon={ IconConstants.DROPDOWN }/>
      { translate('Create directory', t, UI.Modules.COMMON) }
    </div>

    <div className="content create-section">
      <ActionInput 
        caption={ translate('Create', t, UI.Modules.COMMON) } 
        icon={ IconConstants.CREATE }
        handleAction={ handleAction } 
        placeholder={ translate('Directory name', t, UI.Modules.COMMON) }
      />
    </div>
  </Accordion>
);

CreateDirectorySection.propTypes = {
  // Function to call with the value
  handleAction: PropTypes.func.isRequired
};

export interface FileBrowserLayoutProps extends Pick<FileItemListProps, 'itemIconGetter'> {
  historyId?: string;
  initialPath: string;
  onDirectoryChanged: (path: string) => void;
  onFileSelected?: (path: string) => void;
  selectedNameFormatter?: SelectedNameFormatter;
  selectMode: UI.FileSelectModeEnum;
}

interface State {
  currentDirectory: string;
  items: API.FilesystemItem[];
  loading: boolean;
  error: string | null;
}

const joinDirectory = (path: string, directoryName: string, separator: string) => {
  return path + directoryName + separator;
};

type Props = FileBrowserLayoutProps & WithTranslation;
class FileBrowserLayout extends React.Component<Props, State> {
  static propTypes = {
    // Local storage ID used for saving/loading the last path
    // This will have priority over initialPath
    historyId: PropTypes.string,

    // Initial directory to show
    initialPath: PropTypes.string.isRequired,

    // Function to call when changing the directory. Receives the path as param.
    onDirectoryChanged: PropTypes.func.isRequired,

    // Getter for additional content displayed next to file/directory items
    itemIconGetter: PropTypes.func,

    selectedNameFormatter: PropTypes.func,
  };

  static defaultProps: Pick<Props, 'initialPath'> = {
    initialPath: '',
  };

  get pathSeparator() {
    return LoginStore.systemInfo.path_separator;
  }

  get isWindows() {
    return LoginStore.systemInfo.platform === API.PlatformEnum.WINDOWS;
  }

  initialFetchCompleted: boolean = false;

  constructor(props: Props) {
    super(props);

    let currentDirectory = loadLocalProperty<string | undefined>(this.getStorageKey());
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
    const { historyId } = this.props;
    if (!historyId) {
      return undefined;
    }

    return `browse_${historyId}`;
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
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

  _handleSelect = (item: API.FilesystemItem) => {
    const { currentDirectory } = this.state;
    if (item.type.id !== 'file') {
      // Directory/drive/other
      const nextPath = joinDirectory(currentDirectory, item.name, this.pathSeparator);
      this.fetchItems(nextPath);
    } else {
      // File
      const { onFileSelected } = this.props;
      if (onFileSelected) {
        onFileSelected(currentDirectory + item.name);
      }
    }
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
    const { currentDirectory, error, items, loading } = this.state;
    const { selectedNameFormatter, itemIconGetter, t, selectMode } = this.props;

    if (loading) {
      return <Loader text={ translate('Loading items', t, UI.Modules.COMMON) }/>;
    }


    const hasEditAccess = LoginStore.hasAccess(API.AccessEnum.FILESYSTEM_EDIT);
    const rootName = translate(this.isWindows ? 'Computer' : 'Root', t, UI.Modules.COMMON);
    return (
      <div className="file-browser">
        { !!error && (
          <Message 
            isError={ true } 
            title={ translate('Failed to load content', t, UI.Modules.COMMON) } 
            description={ error }
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
          selectMode={ selectMode }
          t={ t }
        />
        { !!this.state.currentDirectory && hasEditAccess && selectMode !== UI.FileSelectModeEnum.EXISTING_FILE  && (
          <CreateDirectorySection 
            handleAction={ this._createDirectory }
            t={ t }
          />
        ) }
      </div>
    );
  }
}

export default withTranslation()(FileBrowserLayout);
