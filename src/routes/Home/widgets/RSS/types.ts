import * as UI from '@/types/ui';

export type FeedNode<Attributes extends object = UI.EmptyObject> =
  | string
  | {
      text: string;
      attr: Attributes;
    };

export interface FeedItem {
  title?: FeedNode;
  updated?: FeedNode;
  pubDate?: FeedNode;
  guid?: FeedNode;
  id?: FeedNode;
  link?: FeedNode<{
    href: string;
  }>;
}

export interface RawFeedData {
  rss?: {
    channel?: {
      item?: FeedItem[];
    };
  };
  feed?: {
    entry?: FeedItem[];
  };
}
