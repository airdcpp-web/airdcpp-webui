import * as UI from '@/types/ui';

import { getFileName, getFilePath } from '@/utils/FileUtils';
import { useState } from 'react';
import { loadLocalProperty, saveLocalProperty } from '@/utils/BrowserUtils';
import { useSession } from '@/context/AppStoreContext';

export type FileSelectionHandler = (path: string) => void;
export type CloseHandler = () => Promise<void> | void;

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

import * as API from '@/types/api';

export const useFileItemSelection = ({
  initialPath,
  onConfirm,
  selectMode,
  historyId,
}: FileItemSelectionProps) => {
  const { system_info: systemInfo } = useSession();
  const isWindows = systemInfo.platform === API.PlatformEnum.WINDOWS;

  const rootPath = isWindows ? '' : '/';

  const getInitialDirectory = () => {
    const loadedPath = loadLocalProperty<string | undefined>(
      getBrowseStorageKey(historyId),
    );
    if (loadedPath) {
      return loadedPath;
    }

    return initialPath.length === 0 ? rootPath : getFilePath(initialPath);
  };

  const [currentDirectory, setCurrentDirectory] = useState(
    getFilePath(getInitialDirectory()),
  );
  const [currentFileName, setCurrentFileName] = useState(getFileName(initialPath));

  const onDirectoryChanged = (newDirectory: string) => {
    saveLocalProperty(getBrowseStorageKey(historyId), newDirectory);
    setCurrentDirectory(newDirectory);
  };

  const onFileSelected = (fileName: string) => {
    if (selectMode === UI.FileSelectModeEnum.EXISTING_FILE) {
      onConfirm(currentDirectory + fileName);
    } else {
      setCurrentFileName(fileName);
    }
  };

  const handleConfirm = () => {
    onConfirm(currentDirectory + currentFileName);
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
    rootPath,
  };
};
