import { memo } from 'react';
import * as React from 'react';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { useRestoreScroll } from '@/effects';
import { useHref } from 'react-router';
import { useSession } from '@/context/AppStoreContext';
import { getFileViewerElement } from './FileViewerElement';

export interface FileContentProps {
  file: API.ViewFile;
  sessionT: UI.ModuleTranslator;
  scrollPositionHandler: UI.ScrollHandler;
}
const getUrl = (basePath: string, tth: string, authToken: string) => {
  return `${basePath}view/${tth}?auth_token=${authToken}`;
};

const FileContent: React.FC<FileContentProps> = memo(function FileContent({
  file,
  sessionT,
  scrollPositionHandler,
}) {
  const { auth_token: authToken } = useSession();
  const basePath = useHref('/');
  const { scrollable, onScrollableContentReady } = useRestoreScroll(
    scrollPositionHandler,
    file,
  );

  const ViewerElement = getFileViewerElement(file);

  let child;
  if (!ViewerElement) {
    child = sessionT.translate('Unsupported format');
  } else {
    child = (
      <ViewerElement
        item={file}
        url={getUrl(basePath, file.tth, authToken)}
        type={file.mime_type}
        extension={file.type.str}
        sessionT={sessionT}
        onReady={onScrollableContentReady}
      />
    );
  }

  return (
    <article ref={scrollable} className="content">
      {child}
    </article>
  );
});

export default FileContent;
