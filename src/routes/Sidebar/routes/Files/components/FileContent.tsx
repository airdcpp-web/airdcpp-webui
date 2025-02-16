import { memo } from 'react';
import * as React from 'react';

import { AudioFile, ImageFile, VideoFile, TextFile } from 'components/file-preview';

import Moment from 'moment';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { fetchData } from 'utils/HttpUtils';
import { useRestoreScroll } from 'effects';
import { useHref } from 'react-router';
import { useSession } from 'context/SessionContext';

export interface FileContentProps {
  session: API.ViewFile;
  sessionT: UI.ModuleTranslator;
  scrollPositionHandler: UI.ScrollHandler;
}

interface ViewerElementProps {
  item: API.ViewFile;
  url: string;
  type: string;
  extension: string;
  sessionT: UI.ModuleTranslator;
  onReady: () => void;
}

const useAutoPlay = (item: API.ViewFile) => {
  const diff = Moment.duration(Moment().diff(Moment.unix(item.time_opened)));
  return diff.asMinutes() <= 1;
};

const getViewerElement = (
  item: API.ViewFile,
): React.ComponentType<ViewerElementProps> | null => {
  if (item.text) {
    // eslint-disable-next-line react/display-name
    return (props: ViewerElementProps) => (
      <TextFile
        {...props}
        textGetter={() => {
          return fetchData(props.url)
            .then((data) => data.text())
            .then((text) => {
              props.onReady();
              return text;
            });
        }}
        url={props.url}
      />
    );
  }

  switch (item.type.content_type) {
    case 'audio':
      // eslint-disable-next-line react/display-name
      return (props: ViewerElementProps) => (
        <AudioFile autoPlay={useAutoPlay(item)} {...props} />
      );
    case 'picture':
      // eslint-disable-next-line react/display-name
      return (props: ViewerElementProps) => <ImageFile {...props} />;
    case 'video':
      // eslint-disable-next-line react/display-name
      return (props: ViewerElementProps) => (
        <VideoFile autoPlay={useAutoPlay(item)} {...props} />
      );
    default:
  }

  return null;
};

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
  const { scrollable, restoreScrollPosition } = useRestoreScroll(
    scrollPositionHandler,
    session,
  );

  const ViewerElement = getViewerElement(session);

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
        onReady={restoreScrollPosition}
      />
    );
  }

  return (
    <div ref={scrollable} className="content">
      {child}
    </div>
  );
});

export default FileContent;
