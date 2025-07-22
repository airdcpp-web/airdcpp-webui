import { memo } from 'react';
import * as React from 'react';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { useRestoreScroll } from '@/effects';
import { useHref } from 'react-router';
import { useSession } from '@/context/SessionContext';
import { getFileViewerElement } from './FileViewerElement';

export interface FileContentProps {
  session: API.ViewFile;
  sessionT: UI.ModuleTranslator;
  scrollPositionHandler: UI.ScrollHandler;
}
const getUrl = (basePath: string, tth: string, authToken: string) => {
  return `${basePath}view/${tth}?auth_token=${authToken}`;
};

const FileContent: React.FC<FileContentProps> = memo(function FileContent({
  session,
  sessionT,
  scrollPositionHandler,
}) {
  const { authToken } = useSession();
  const basePath = useHref('/');
  const { scrollable, onScrollableContentReady } = useRestoreScroll(
    scrollPositionHandler,
    session,
  );

  const ViewerElement = getFileViewerElement(session);

  let child;
  if (!ViewerElement) {
    child = sessionT.translate('Unsupported format');
  } else {
    child = (
      <ViewerElement
        item={session}
        url={getUrl(basePath, session.tth, authToken)}
        type={session.mime_type}
        extension={session.type.str}
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
