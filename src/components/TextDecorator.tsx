'use strict';

import React, { memo } from 'react';

//@ts-ignore
import { default as ReactLinkify, linkify } from 'react-linkify';

// Convert :D, :P etc. to unicode
// Increases the compressed bundle size by ~20 kilobytes so a simplified custom
// implementation could be considered that would only replace ascii emoticons
//@ts-ignore
import { emojify as emojisToUnicode } from 'react-emojione';

//@ts-ignore
import emoji from 'react-easy-emoji';
//@ts-ignore
import makeTwemojiRenderer from 'react-easy-emoji/lib/makeTwemojiRenderer';

import History from 'utils/History';
import HubActions from 'actions/reflux/HubActions';
import HubSessionStore from 'stores/HubSessionStore';

import LoginStore from 'stores/LoginStore';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';

import * as API from 'types/api';


linkify.add('magnet:', {
  validate: (text: string, pos: number, self: { re: { magnet: RegExp } }) => {
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
  validate: (text: string, pos: number, self: { re: { link_fuzzy: RegExp } }) => {
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


const onClickLink = (evt: React.MouseEvent<HTMLLinkElement>, location: Location) => {
  const uri: string = (evt.target as any).href;
  if (uri.indexOf('magnet:?xt=urn:tree:tiger:') === 0) {
    evt.preventDefault();

    if (!LoginStore.hasAccess(API.AccessEnum.SEARCH)) {
      return;
    }

    const tth = uri.slice(26, 26 + 39);
    History.pushUnique(
      {
        pathname: '/search',
        state: {
          searchString: tth,
        }
      }, 
      location
    );
  } else if (uri.indexOf('adc://') === 0 || uri.indexOf('adcs://') === 0 || uri.indexOf('dchub://') === 0) {
    evt.preventDefault();

    if (!LoginStore.hasAccess(API.AccessEnum.HUBS_EDIT)) {
      return;
    }

    HubActions.createSession(location, uri, HubSessionStore);
  }
};

const emojiRenderer = (code: string, str: string, key: string) => {
  switch (code) {
    case 'a9': // © copyright
    case 'ae': // ® registered trademark
    case '2122': // ™ trademark
      return str;
    default:
  }


  const renderer = makeTwemojiRenderer({
    props: {
      style: {
        height: '20px',
        width: '20px',
      }
    }
  });

  return renderer(code, str, key);
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
      properties={{ 
        target: '_blank',
        rel: 'noreferrer',
        onClick: evt => onClickLink(evt, location),
      } as React.HTMLProps<HTMLLinkElement> }
    >
      { !emojify ? text : emoji(emojisToUnicode(text, { output: 'unicode' }), emojiRenderer) }
    </ReactLinkify>
  );
};

const Decorated = memo(TextDecorator);

export default Decorated;