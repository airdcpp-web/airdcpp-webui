import { useEffect, useRef, useState } from 'react';

import FilesystemConstants from 'constants/FilesystemConstants';

import { loadLocalProperty, saveLocalProperty } from 'utils/BrowserUtils';
import { translate } from 'utils/TranslationUtils';

import BrowserBar, { SelectedNameFormatter } from 'components/browserbar';

import FileItemList, { FileItemListProps } from './sections/FileItemList';
import { CreateDirectorySection } from './sections/CreateDirectorySection';
import { FileNameSection } from './sections/FileNameSection';

import * as API from 'types/api';
import * as UI from 'types/ui';

import './style.css';
import { FileItemSelectionProps } from './effects/useFileItemSelection';
import { useSession } from 'context/SessionContext';
import { useSocket } from 'context/SocketContext';
import { useTranslation } from 'react-i18next';
import NotificationActions from 'actions/NotificationActions';

export interface FileBrowserLayoutProps
  extends Pick<FileItemListProps, 'itemIconGetter'>,
    Pick<FileItemSelectionProps, 'selectMode' | 'initialPath'> {
  // Local storage ID used for saving/loading the last path
  // This will have priority over initialPath
  historyId?: string;

  currentFileName?: string;

  // Function to call when changing the directory. Receives the path as param.
  onDirectoryChanged: (path: string) => void;

  onFileSelected?: (fileName: string) => void;
  selectedNameFormatter?: SelectedNameFormatter;
}

interface DataLoaderState {
  items: API.FilesystemItem[];
  loading: boolean;
  error: string | null;
}

const joinDirectory = (path: string, directoryName: string, separator: string) => {
  return path + directoryName + separator;
};

type Props = FileBrowserLayoutProps;
const FileBrowserLayout: React.FC<Props> = ({
  selectedNameFormatter,
  itemIconGetter,
  onDirectoryChanged,
  selectMode,
  currentFileName,
  onFileSelected,
  historyId,
  initialPath = '',
}) => {
  const { t } = useTranslation();

  const socket = useSocket();

  const { systemInfo, hasAccess } = useSession();

  const pathSeparator = systemInfo.path_separator;
  const isWindows = systemInfo.platform === API.PlatformEnum.WINDOWS;

  const getStorageKey = () => {
    if (!historyId) {
      return undefined;
    }

    return `browse_${historyId}`;
  };

  const getRootPath = () => {
    return isWindows ? '' : '/';
  };

  const getInitialPath = () => {
    const loadedPath = loadLocalProperty<string | undefined>(getStorageKey());
    if (loadedPath) {
      return loadedPath;
    }

    return initialPath.length === 0 ? getRootPath() : initialPath;
  };

  const [currentDirectory, setCurrentDirectory] = useState(getInitialPath());

  const handleDirectoryChanged = () => {
    // Save the location
    saveLocalProperty(getStorageKey(), currentDirectory);

    // Props
    if (onDirectoryChanged) {
      onDirectoryChanged(currentDirectory);
    }
  };

  const [dataState, setDataState] = useState<DataLoaderState>({
    items: [],
    loading: true,
    error: null,
  });

  const resetError = () => {
    if (!dataState.error) {
      return;
    }

    setDataState({
      ...dataState,
      error: null,
    });
  };

  const onFetchFailed = (error: Error) => {
    onDirectoryChanged('');

    setDataState({
      ...dataState,
      error: error.message,
      loading: false,
    });
  };

  const onFetchSucceed = (path: string, data: API.FilesystemItem[]) => {
    setDataState({
      error: null,
      items: data,
      loading: false,
    });
  };

  const fetchItems = (path: string) => {
    setDataState({
      ...dataState,
      error: null,
      loading: true,
    });

    socket
      .post(FilesystemConstants.LIST_URL, {
        path: path,
        directories_only: false,
      })
      .then(onFetchSucceed.bind(this, path))
      .catch(onFetchFailed);
  };

  useEffect(() => {
    resetError();
    handleDirectoryChanged();
    fetchItems(currentDirectory);
  }, [currentDirectory]);

  const handleSelect = (item: API.FilesystemItem) => {
    if (item.type.id !== 'file') {
      // Directory/drive/other
      const nextPath = joinDirectory(currentDirectory, item.name, pathSeparator);
      setCurrentDirectory(nextPath);
    } else {
      // File
      if (onFileSelected) {
        onFileSelected(item.name);
      }
    }
  };

  const createDirectory = (directoryName: string) => {
    const newPath = currentDirectory + directoryName + pathSeparator;
    socket
      .post(FilesystemConstants.DIRECTORY_URL, { path: newPath })
      .then(() => {
        setCurrentDirectory(newPath);
      })
      .catch((error: Error) => {
        NotificationActions.error({
          title: t('Failed to create directory', UI.Modules.COMMON),
          message: error.message,
        });
      });
  };

  const hasEditAccess = hasAccess(API.AccessEnum.FILESYSTEM_EDIT);
  const rootName = translate(isWindows ? 'Computer' : 'Root', t, UI.Modules.COMMON);

  const canCreateDirectory =
    currentDirectory &&
    hasEditAccess &&
    !dataState.error &&
    selectMode !== UI.FileSelectModeEnum.EXISTING_FILE;
  return (
    <div className="file-browser">
      <BrowserBar
        path={currentDirectory}
        separator={pathSeparator}
        rootPath={getRootPath()}
        rootName={rootName}
        itemClickHandler={(path) => {
          setCurrentDirectory(path);
        }}
        selectedNameFormatter={selectedNameFormatter}
      />
      <FileItemList
        items={dataState.loading ? null : dataState.items}
        itemClickHandler={handleSelect}
        itemIconGetter={itemIconGetter}
        selectMode={selectMode}
        currentFileName={currentFileName}
        error={dataState.error}
      />
      {canCreateDirectory && (
        <CreateDirectorySection handleAction={createDirectory} t={t} />
      )}
      {selectMode === UI.FileSelectModeEnum.FILE &&
        !!onFileSelected &&
        currentFileName !== undefined && (
          <FileNameSection
            currentFileName={currentFileName}
            onChange={onFileSelected}
            t={t}
          />
        )}
    </div>
  );
};

export default FileBrowserLayout;
