'use strict';

import React, { memo } from 'react';

import { useLocation } from 'react-router-dom';
import { Location } from 'history';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { formatEmojis } from 'utils/EmojiFormat';

import { MagnetHighlight, MeHighlight, ReleaseHighlight, UrlHighlight } from './highlights';


const getHighlightNode = (
  highlight: API.MessageHighlight, 
  user: UI.DownloadSource | undefined, 
  addDownload: UI.AddItemDownload,
  location: Location, 
  t: TFunction
): React.ReactNode => {
  const { start, end } = highlight.position;
  const key = `${start}-${end}`;
  switch (highlight.type) {
    case API.MessageHighlightTypeEnum.ME:
      return (
        <MeHighlight
          key={ key }
          text={ highlight.text }
          location={ location }
        />
      );
    case API.MessageHighlightTypeEnum.RELEASE_NAME:
      return (
        <ReleaseHighlight
          key={ key }
          text={ highlight.text }
          location={ location }
        />
      );
    case API.MessageHighlightTypeEnum.TEMP_SHARE:
    case API.MessageHighlightTypeEnum.URL: {
      if (highlight.text.startsWith('magnet:?') && highlight.content_type !== null) {
        return (
          <MagnetHighlight
            key={ key }
            text={ highlight.text }
            dupe={ highlight.dupe }
            contentType={ highlight.content_type }
            user={ user }
            addDownload={ addDownload }
            t={ t }
          />
        );
      }

      return (
        <UrlHighlight
          key={ key }
          text={ highlight.text }
          location={ location }
        />
      );
    }
    default: {
      return highlight.text;
    }
  }
};

interface MessageTextDecoratorProps {
  text: string;
  highlights: API.MessageHighlight[];
  user: UI.DownloadSource | undefined;
  emojify?: boolean;
  addDownload: UI.AddItemDownload;
}

const formatHighlights = (
  { text, highlights, emojify, user, addDownload }: MessageTextDecoratorProps, 
  location: Location, 
  t: TFunction
) => {
  let prevReplace = 0;
  const elements: React.ReactNode[] = [];
  const pushText = (newStart: number) => {
    let textElement: React.ReactNode = text.substr(prevReplace, newStart - prevReplace);
    if (emojify) {
      textElement = formatEmojis(textElement);
    }

    elements.push(textElement);
  };

  for (const highlight of highlights) {
    const { start, end } = highlight.position;

    pushText(start);
    elements.push(getHighlightNode(highlight, user, addDownload, location, t));

    prevReplace = end;
  }

  if (prevReplace !== text.length) {
    pushText(text.length);
  }

  return elements;
};

export const HighlightedText: React.FC<MessageTextDecoratorProps> = memo((
  props
) => {
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <>
      { formatHighlights(props, location, t) }
    </>
  );
});
