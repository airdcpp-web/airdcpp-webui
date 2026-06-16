import * as React from 'react';

import { AudioFile, ImageFile, VideoFile, TextFile } from '@/components/file-preview';

import dayjs from 'dayjs';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { fetchData } from '@/utils/HttpUtils';

interface ViewerElementProps {
  item: API.ViewFile;
  url: string;
  type: string;
  extension: string;
  sessionT: UI.ModuleTranslator;
  onReady: () => void;
}

const useAutoPlay = (item: API.ViewFile) => {
  const diff = dayjs().diff(dayjs.unix(item.time_opened), 'minute');
  return diff <= 1;
};

const TextViewerElement = (props: ViewerElementProps) => (
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
  />
);

const AudioViewerElement = (props: ViewerElementProps) => (
  <AudioFile autoPlay={useAutoPlay(props.item)} {...props} />
);

const VideoViewerElement = (props: ViewerElementProps) => (
  <VideoFile autoPlay={useAutoPlay(props.item)} {...props} />
);

export const getFileViewerElement = (
  item: API.ViewFile,
): React.ComponentType<ViewerElementProps> | null => {
  if (item.text) {
    return TextViewerElement;
  }

  switch (item.type.content_type) {
    case 'audio':
      return AudioViewerElement;
    case 'picture':
      return ImageFile;
    case 'video':
      return VideoViewerElement;
    default:
  }

  return null;
};
