import { parse as parseXML, X2jOptions } from 'fast-xml-parser';
import { decode } from 'he';

import { fetchCorsSafeData } from 'services/HttpService';

import * as UI from 'types/ui';

import { FeedItem, FeedNode, RawFeedData } from './types';


export const parseNodeContent = (node: FeedNode) => {
  return typeof node === 'string' ? node : node.text;
};

export const getUniqueEntryKey = (entry: FeedItem): string => {
  if (!!entry.guid) {
    return parseNodeContent(entry.guid);
  }

  if (!!entry.id) {
    return parseNodeContent(entry.id);
  }

  return 'DUMMY';
};

const XMLParserOptions: Partial<X2jOptions> = {
  attrNodeName: 'attr',
  textNodeName : 'text',
  parseAttributeValue : true,
  ignoreAttributes : false,
  attributeNamePrefix: '',
  attrValueProcessor: a => decode(a, { isAttributeValue: true }),
  tagValueProcessor : a => decode(a),
};

export const fetchRSSFeed = async (feedUrl: string) => {
  const data = await fetchCorsSafeData(feedUrl, false);

  console.log('RSS feed received', feedUrl);

  const jsonFeed = parseXML(data, XMLParserOptions);
  return jsonFeed;
};

export const parseRSSFeed = (data: RawFeedData, moduleT: UI.ModuleTranslator): FeedItem[] | undefined => {
  let entries = [];

  const invalidFeed = (error: string) => {
    console.log(`Invalid feed: ${error}`);
    throw new Error(moduleT.t('invalidFeed', { error }));
  };

  const { rss, feed } = data;
  if (rss) {
    if (!rss.channel || !rss.channel.item) {
      invalidFeed('No channel/item');
      return;
    }

    entries = rss.channel.item;
  } else if (feed) {
    if (!feed.entry) {
      invalidFeed('No feed entry');
      return;
    }

    entries = feed.entry;
  } else {
    invalidFeed('No "rss" or "feed" tag was found');
    return;
  }

  if (!Array.isArray(entries)) {
    if (typeof entries !== 'object') {
      invalidFeed('Entries is not an array or an object');
      return;
    }

    // Single entry, convert to an array
    entries = [ entries ];
  }

  return entries;
};
