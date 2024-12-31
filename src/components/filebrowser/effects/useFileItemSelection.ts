import * as UI from 'types/ui';

import { getFileName, getFilePath } from 'utils/FileUtils';
import { useRef, useState } from 'react';
import { loadLocalProperty, saveLocalProperty } from 'utils/BrowserUtils';
import { useSession } from 'context/SessionContext';

export type FileSelectionHandler = (path: string) => void;

export interface FileItemSelectionProps {
  // Initial directory to show
  initialPath: string;
  selectMode: UI.FileSelectModeEnum;

  onConfirm: FileSelectionHandler;

  // Local storage ID used for saving/loading the last path
  // This will have priority over initialPath
  historyId: string | undefined;
}

export const getBrowseStorageKey = (historyId: string | undefined) => {
  if (!historyId) {
    return undefined;
  }

  return `browse_${historyId}`;
};

import * as API from 'types/api';

export const useFileItemSelection = ({
  initialPath,
  onConfirm,
  selectMode,
  historyId,
}: FileItemSelectionProps) => {
  const { systemInfo } = useSession();
  const isWindows = systemInfo.platform === API.PlatformEnum.WINDOWS;

  const getRootPath = () => {
    return isWindows ? '' : '/';
  };

  const getInitialDirectory = () => {
    const loadedPath = loadLocalProperty<string | undefined>(
      getBrowseStorageKey(historyId),
    );
    if (loadedPath) {
      return loadedPath;
    }

    return initialPath.length === 0 ? getRootPath() : getFilePath(initialPath);
  };

  const [currentDirectory, setCurrentDirectory] = useState(
    getFilePath(getInitialDirectory()),
  );
  const [currentFileName, setCurrentFileName] = useState(getFileName(initialPath));
  const selection = useRef(currentDirectory + currentFileName);

  const onDirectoryChanged = (newDirectory: string) => {
    if (selectMode === UI.FileSelectModeEnum.DIRECTORY) {
      selection.current = newDirectory;
    } else {
      selection.current = newDirectory + currentFileName;
    }

    saveLocalProperty(getBrowseStorageKey(historyId), newDirectory);
    setCurrentDirectory(newDirectory);
  };

  const onFileSelected = (fileName: string) => {
    if (selectMode === UI.FileSelectModeEnum.EXISTING_FILE) {
      onConfirm(selection.current + fileName);
    } else {
      selection.current = currentDirectory + currentFileName;
      setCurrentFileName(fileName);
    }
  };

  const handleConfirm = () => {
    onConfirm(selection.current);
    return Promise.resolve();
  };

  const approveDisabled = () => {
    if (currentDirectory.length === 0) {
      return true;
    }

    if (selectMode === UI.FileSelectModeEnum.FILE && currentFileName.length === 0) {
      return true;
    }

    return false;
  };

  return {
    approveDisabled,
    onFileSelected,
    onDirectoryChanged,
    handleConfirm,
    currentFileName,
    currentDirectory,
  };
};
