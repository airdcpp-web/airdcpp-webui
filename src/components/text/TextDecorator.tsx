'use strict';

import React, { memo } from 'react';

import ReactLinkify from 'react-linkify';
import { LinkifyIt as linkify } from 'linkify-it';

import { useLocation } from 'react-router-dom';
import { formatEmojis } from 'utils/EmojiFormat';


import LinkifyIt from 'linkify-it';
import tlds from 'tlds';
import { UrlHighlight } from './highlights';

const linkify = new LinkifyIt();
linkify.tlds(tlds);

linkify.add('magnet:', {
  validate: (text, pos, self) => {
    const tail = text.slice(pos);
    if (!self.re.magnet) {
      self.re.magnet = /^(\?xt=urn:[a-zA-Z0-9:]+:[a-zA-Z0-9]{32,128}(&[\S]+)?)/g;
    }

    if (self.re.magnet.test(tail)) {
      const match = tail.match(self.re.magnet);
      if (match) {
        return match[0].length;
      }
    }

    return 0;
  }
});

linkify.add('dchub://', {
  validate: (text, pos, self) => {
    const tail = text.slice(pos);
    if (self.re.link_fuzzy.test(tail)) {
      const match = tail.match(self.re.link_fuzzy);
      if (match) {
        return match[0].length;
      }
    }

    return 0;
  }
});

// Aliases
linkify.add('adc://', 'dchub://');
linkify.add('adcs://', 'dchub://');

const matchDecorator = (text: string) => {
  return linkify.match(text);
};

interface TextDecoratorProps {
  emojify?: boolean;
  text: React.ReactNode;
}

// Parses links from plain text and optionally emoticons as well
const TextDecorator: React.FC<TextDecoratorProps> = (
  { emojify = false, text }
) => {
  const location = useLocation();
  return (
    <ReactLinkify 
      matchDecorator={ matchDecorator }
      componentDecorator={ (decoratedHref, decoratedText, key) => (
        <UrlHighlight
          key={ key }
          text={ decoratedText }
          href={ decoratedHref }
          location={ location }
        />
      ) }
    >
      { !emojify ? text : formatEmojis(text) }
    </ReactLinkify>
  );
};

const Decorated = memo(TextDecorator);

export default Decorated;