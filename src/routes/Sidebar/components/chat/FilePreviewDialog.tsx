import React, { useEffect, useState } from 'react';
import Modal, { ModalProps } from 'components/semantic/Modal';

import IconConstants from 'constants/IconConstants';
import { formatSize } from 'utils/ValueFormat';
import { useTranslation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';

import { AudioFile, ImageFile, TextFile, VideoFile } from 'components/file-preview';

import Message from 'components/semantic/Message';
import i18next from 'i18next';
import LayoutHeader from 'components/semantic/LayoutHeader';
import { fileToText } from 'utils/FileUtils';


interface FilePreviewDialogProps extends ModalProps {
  file: File;
  onConfirm: (file: File) => Promise<void>;

}

const getViewerElement = (file: File, previewUrl: string, t: i18next.TFunction) => {
  if (file.type.indexOf('text') !== -1 && file.size <= 1 * 1024 * 1024) {
    return (
      <TextFile
        textGetter={ () => fileToText(file) }
      />
    );
  }

  if (file.type.indexOf('audio') !== -1) {
    return <AudioFile url={ previewUrl } autoPlay={ false }/>;
  }

  if (file.type.indexOf('image') !== -1) {
    return <ImageFile url={ previewUrl } alt={ file.name }/>;
  }

  if (file.type.indexOf('video') !== -1) {
    return <VideoFile url={ previewUrl } autoPlay={ false }/>;
  }

  return (
    <Message
      title={ translate('Preview is not available', t, UI.Modules.COMMON) }
    />
  );
};

const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({ file, onConfirm, ...other }) => {
  const [ preview, setPreview ] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(
    () => {
      const p = URL.createObjectURL(file);
      setPreview(p);
      return () => URL.revokeObjectURL(p); 
    },
    []
  );

  const handleConfirm = () => {
    return onConfirm(file);
  };

  const PreviewElement = getViewerElement(file, preview!, t);
  return (
    <Modal
      { ...other }
      className="file-preview-dialog"
      onApprove={ handleConfirm }
      closable={ true }
      fullHeight={ true }
      approveCaption={ translate('Upload', t, UI.Modules.COMMON) }
      icon={ IconConstants.UPLOAD }
    >      
      {/*<div>
        { file.name }
        <span style={{ color: 'gray' }}>
          { ` (${formatSize(file.size, t)})` }
        </span>
      </div>*/}
      <LayoutHeader
        title={ file.name }
        subHeader={ formatSize(file.size, t) }
      />
      { PreviewElement }
    </Modal>
  );
};

export default FilePreviewDialog;