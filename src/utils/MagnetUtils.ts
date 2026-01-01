import { Formatter } from '@/context/FormatterContext';
import * as UI from '@/types/ui';

export const makeHashMagnetLink = (data: UI.HashMagnet) => {
  const { size, tth, name } = data;
  const sizeParam = !!size && size > 0 ? `&xl=${size}` : '';
  const link = `magnet:?xt=urn:tree:tiger:${tth}${sizeParam}&dn=${encodeURIComponent(
    name,
  )}`;

  return link;
};

export const makeTextMagnetLink = (data: UI.Magnet) => {
  const { size, name } = data;
  const encodedName = encodeURIComponent(name);
  const sizeParam = !!size && size > 0 ? `&xl=${size}` : '';

  const link = `magnet:?kt=${encodedName}${sizeParam}&dn=${encodedName}`;
  return link;
};

export const parseMagnetLink = (text: string): UI.HashMagnet | UI.TextMagnet | null => {
  if (text.length < 10) {
    return null;
  }

  let fname: string | undefined,
    fsize: number | undefined,
    hash: string | undefined,
    searchString: string | undefined;

  {
    const hashes: Record<string, string> = {};
    try {
      const params = new URLSearchParams(text.substring(8));
      for (const [type, param] of params.entries()) {
        if (param.length === 85 && param.startsWith('urn:bitprint:')) {
          hashes[type] = param.substring(46);
        } else if (param.length === 54 && param.startsWith('urn:tree:tiger:')) {
          hashes[type] = param.substring(15);
        } else if (param.length === 55 && param.startsWith('urn:tree:tiger/:')) {
          hashes[type] = param.substring(16);
        } else if (param.length === 59 && param.startsWith('urn:tree:tiger/1024:')) {
          hashes[type] = param.substring(20);
        } else if (type.length === 2 && type.startsWith('dn')) {
          fname = param;
        } else if (type.length === 2 && type.startsWith('xl')) {
          fsize = Number.parseInt(param);
        } else if (type.length === 2 && type.startsWith('kt')) {
          searchString = param;
        }
      }
    } catch (e) {
      console.warn(`Failed to parse magnet link ${text}`, e);
      return null;
    }

    if (hashes['xt']) {
      hash = hashes['xt'];
    } else if (hashes['xs']) {
      hash = hashes['xs'];
    } else if (hashes['as']) {
      hash = hashes['as'];
    }
  }

  if (!!hash) {
    // Hash
    if (!!fname && !!fsize) {
      return {
        name: fname,
        size: fsize,
        tth: hash,
      };
    }
  } else if (!!searchString) {
    // Text search
    if (!!fname) {
      return {
        name: fname,
        size: fsize,
        searchString,
      };
    }
  }

  return null;
};

export const formatMagnetCaption = (magnet: UI.Magnet, { formatSize }: Formatter) => {
  const { name, size } = magnet;

  let description = '';
  if (!!size) {
    description += formatSize(size);
  }

  if (!description) {
    return name;
  }

  return `${name} (${description})`;
};
