import Modal, { ModalProps } from '@/components/semantic/Modal';

import FileBrowserLayout from './FileBrowserLayout';

import ModalRouteDecorator from '@/decorators/ModalRouteDecorator';
import { useTranslation } from 'react-i18next';
import { translate } from '@/utils/TranslationUtils';

import * as UI from '@/types/ui';

import IconConstants from '@/constants/IconConstants';
import RouteModal from '@/components/semantic/RouteModal';
import {
  FileItemSelectionProps,
  useFileItemSelection,
} from './effects/useFileItemSelection';

export interface FileBrowserDialogProps
  extends FileItemSelectionProps,
    Omit<ModalProps, 'title' | 'location'>,
    Pick<FileItemSelectionProps, 'historyId'> {
  title?: React.ReactNode;
  modalComponent?: React.ComponentType<ModalProps>;
}

export const FileBrowserDialog: React.FC<FileBrowserDialogProps> = ({
  title,
  historyId,
  icon,
  approveCaption,
  selectMode,
  onConfirm,
  initialPath = '',

  modalComponent: ModalComponent = Modal,
  ...other
}) => {
  const {
    approveDisabled,
    handleConfirm,
    currentFileName,
    onDirectoryChanged,
    onFileSelected,
    currentDirectory,
  } = useFileItemSelection({
    onConfirm,
    initialPath,
    selectMode,
    historyId,
  });

  const selectDirectory = selectMode === UI.FileSelectModeEnum.DIRECTORY;
  const showApprove = selectMode !== UI.FileSelectModeEnum.EXISTING_FILE;
  const { t } = useTranslation();
  return (
    <ModalComponent
      {...other}
      className="file-browser-dialog"
      title={title || translate('Browse...', t, UI.Modules.COMMON)}
      onApprove={showApprove ? handleConfirm : undefined}
      closable={true}
      fullHeight={true}
      approveDisabled={approveDisabled()}
      approveCaption={approveCaption || translate('Select', t, UI.Modules.COMMON)}
      icon={icon || (selectDirectory ? IconConstants.BROWSE : IconConstants.FILE)}
      autoFocus={false}
    >
      <FileBrowserLayout
        currentDirectory={currentDirectory}
        onDirectoryChanged={onDirectoryChanged}
        onFileSelected={onFileSelected}
        selectMode={selectMode}
        currentFileName={currentFileName}
      />
    </ModalComponent>
  );
};

export const FileBrowserRouteDialog = ModalRouteDecorator<
  Omit<FileBrowserDialogProps, 'modalComponent' | 'handleClose'>
>((props) => <FileBrowserDialog modalComponent={RouteModal} {...props} />, 'browse');
