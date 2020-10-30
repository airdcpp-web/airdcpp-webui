'use strict';

import * as React from 'react';

// Convert :D, :P etc. to unicode
// Increases the compressed bundle size by ~20 kilobytes so a simplified custom
// implementation could be considered that would only replace ascii emoticons
//@ts-ignore
import { emojify as emojisToUnicode } from 'react-emojione';

//@ts-ignore
import emoji from 'react-easy-emoji';
//@ts-ignore
import makeTwemojiRenderer from 'react-easy-emoji/lib/makeTwemojiRenderer';


const emojiRenderer = (code: string, str: string, offset: number) => {
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

  return renderer(code, str, offset);
};

export const formatEmojis = (text: React.ReactNode) => {
  return emoji(emojisToUnicode(text, { output: 'unicode' }), emojiRenderer);
};
