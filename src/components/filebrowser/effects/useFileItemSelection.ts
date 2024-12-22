import * as UI from 'types/ui';

import { getFileName, getFilePath } from 'utils/FileUtils';
import { useState } from 'react';

export type FileSelectionHandler = (
  path: string,
  directoryPath: string,
  fileName: string,
) => void;

export interface FileItemSelectionProps {
  // Initial directory to show
  initialPath: string;
  selectMode: UI.FileSelectModeEnum;

  onConfirm: FileSelectionHandler;
}

export const useFileItemSelection = ({
  initialPath,
  onConfirm,
  selectMode,
}: FileItemSelectionProps) => {
  const [currentPath, setCurrentPath] = useState(getFilePath(initialPath));
  const [currentFileName, setCurrentFileName] = useState(getFileName(initialPath));

  const onDirectoryChanged = (path: string) => {
    setCurrentPath(path);
  };

  const onFileSelected = (fileName: string) => {
    if (selectMode === UI.FileSelectModeEnum.EXISTING_FILE) {
      onConfirm(currentPath + fileName, currentPath, fileName);
    } else {
      setCurrentFileName(fileName);
    }
  };

  const handleConfirm = () => {
    if (selectMode === UI.FileSelectModeEnum.DIRECTORY) {
      onConfirm(currentPath, currentPath, currentFileName);
    } else {
      onConfirm(currentPath + currentFileName, currentPath, currentFileName);
    }

    return Promise.resolve();
  };

  const approveDisabled = () => {
    if (currentPath.length === 0) {
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
  };
};
