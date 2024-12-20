import * as React from 'react';

import NotificationActions from 'actions/NotificationActions';

import * as UI from 'types/ui';

import { toI18nKey } from 'utils/TranslationUtils';
import { useFormatter } from 'utils/ValueFormat';

interface UseFileUploaderProps {
  appendText: (text: string) => void;
  handleFileUpload: UI.ChatFileUploadHandler;
  t: UI.TranslateF;
}

export const useFileUploader = ({
  appendText,
  handleFileUpload,
  t,
}: UseFileUploaderProps) => {
  const { formatSize } = useFormatter();
  const [files, setFiles] = React.useState<File[] | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const resetFiles = () => {
    setFiles(null);
  };

  const onDropFile = (acceptedFiles: File[]) => {
    const maxSize = 100 * 1024 * 1024;

    const files = acceptedFiles.filter((file) => {
      if (file.size > maxSize) {
        NotificationActions.error({
          title: file.name,
          message: t(toI18nKey('fileTooLarge', UI.Modules.COMMON), {
            defaultValue: 'File is too large (maximum size is {{maxSize}})',
            replace: {
              maxSize: formatSize(maxSize),
            },
          }),
        });

        return false;
      }

      return true;
    });

    if (!files.length) {
      return;
    }

    setFiles(files);
  };

  const onUploadFiles = async (files: File[]) => {
    resetFiles();
    setUploading(true);

    for (const file of files) {
      try {
        const res = await handleFileUpload(file);
        appendText(res.magnet);
      } catch (e) {
        NotificationActions.apiError('Failed to upload the file', e);
      }
    }

    setUploading(false);
  };

  const onPaste = (evt: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (
      evt.clipboardData &&
      evt.clipboardData.files &&
      (evt.clipboardData as any).files.length
    ) {
      const files: File[] = [];

      {
        // DataTransferItemList isn't a normal array, convert it first
        // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItemList
        const dataTransferItemList = (evt.clipboardData as any).files as any[];
        for (let i = 0; i < dataTransferItemList.length; i++) {
          files.push(dataTransferItemList[i]);
        }
      }

      evt.preventDefault();
      onDropFile(files);
    }
  };

  return {
    files,
    uploading,
    onDropFile,
    onPaste,
    onUploadFiles,
    resetFiles,
  };
};
