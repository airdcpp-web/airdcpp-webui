// Convert :D, :P etc. to unicode
import { emojify as emojisToUnicode } from '@/utils/emojify/asciiToUnicodeEmoji';

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
      },
    },
  });

  return renderer(code, str, offset);
};

export const formatEmojis = (text: string) => {
  return emoji(emojisToUnicode(text), emojiRenderer);
};
