import { useEffect, useState } from 'react';
import * as React from 'react';
import Modal, { ModalProps } from 'components/semantic/Modal';

import IconConstants from 'constants/IconConstants';
import { useFormatter } from 'context/FormatterContext';
import { useTranslation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';

import * as UI from 'types/ui';

import { AudioFile, ImageFile, TextFile, VideoFile } from 'components/file-preview';

import Message from 'components/semantic/Message';
import LayoutHeader from 'components/semantic/LayoutHeader';
import { fileToText } from 'utils/FileUtils';

interface FilePreviewDialogProps extends ModalProps {
  files: File[];
  onConfirm: (files: File[]) => Promise<void>;
}

const getViewerElement = (file: File, previewUrl: string, t: UI.TranslateF) => {
  if (file.type.includes('text') && file.size <= 1 * 1024 * 1024) {
    return <TextFile textGetter={() => fileToText(file)} />;
  }

  if (file.type.includes('audio')) {
    return <AudioFile url={previewUrl} autoPlay={false} />;
  }

  if (file.type.includes('image')) {
    return <ImageFile url={previewUrl} alt={file.name} />;
  }

  if (file.type.includes('video')) {
    return <VideoFile url={previewUrl} autoPlay={false} />;
  }

  return <Message title={translate('Preview is not available', t, UI.Modules.COMMON)} />;
};

interface PreviewFile {
  file: File;
  url: string;
}

const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({
  files,
  onConfirm,
  ...other
}) => {
  const { formatSize } = useFormatter();
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[] | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setPreviewFiles(previews);
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, []);

  if (!previewFiles) {
    return null;
  }

  const handleConfirm = () => {
    return onConfirm(files);
  };

  return (
    <Modal
      {...other}
      className="file-preview-dialog"
      onApprove={handleConfirm}
      closable={true}
      fullHeight={true}
      approveCaption={translate('Upload', t, UI.Modules.COMMON)}
      icon={IconConstants.UPLOAD}
    >
      {previewFiles.map(({ file, url }) => (
        <div
          key={url}
          className="ui segment"
          style={{
            overflowX: 'auto',
          }}
        >
          <LayoutHeader title={file.name} subHeader={formatSize(file.size)} />
          {getViewerElement(file, url, t)}
        </div>
      ))}
    </Modal>
  );
};

export default FilePreviewDialog;
