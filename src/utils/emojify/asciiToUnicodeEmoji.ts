import ASCII_DATA from './asciiToUnicodeData';

// Based on https://github.com/pladaria/react-emojione

const asciiToUnicodeCache = new Map();
const asciiRegExpToUnicode = new Map();

ASCII_DATA.forEach(([reStr, unicode]) =>
  asciiRegExpToUnicode.set(RegExp(reStr), unicode)
);

const convertAsciiToUnicodeOrNull = (text: string) => {
  if (!text) {
    return '';
  }
  const str = String(text);
  if (asciiToUnicodeCache.has(str)) {
    return asciiToUnicodeCache.get(str);
  }
  for (const [regExp, unicode] of asciiRegExpToUnicode.entries()) {
    if (str.replace(regExp, unicode) === unicode) {
      asciiToUnicodeCache.set(str, unicode);
      return unicode;
    }
  }
  return null;
};

const REGEX = new RegExp(`(${ASCII_DATA.map(([reStr]) => reStr).join('|')})`);

const startsWithSpace = (str: string) => /^\s/.test(str);
const endsWithSpace = (str: string) => /\s$/.test(str);

const shouldConvertAscii = (parts: string[], index: number) => {
  if (parts.length === 1) {
    return true;
  }
  if (index === 0) {
    return startsWithSpace(parts[index + 1]);
  }
  if (index === parts.length - 1) {
    return endsWithSpace(parts[index - 1]);
  }
  return endsWithSpace(parts[index - 1]) && startsWithSpace(parts[index + 1]);
};

export const emojify = (str: string) => {
  const convertedParts = str
    .split(REGEX)
    .filter(Boolean)
    .map((part, index, parts) => {
      if (shouldConvertAscii(parts, index)) {
        const unicode = convertAsciiToUnicodeOrNull(part);
        if (unicode) {
          return unicode;
        }
      }
      return part;
    });

  return convertedParts.join('');
};
