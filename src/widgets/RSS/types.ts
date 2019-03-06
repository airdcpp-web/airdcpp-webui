
export type FeedNode<Attributes extends object = {}> = string | {
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

export const parseNodeContent = (node: FeedNode) => {
  return typeof node === 'string' ? node : node.text;
};
