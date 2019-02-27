export interface FeedItem {
  title?: string | { content: string };
  updated?: string;
  pubDate?: string;
  guid?: string | { content: string };
  id?: string | { content: string };
  link?: string | {
    href: string;
  };
}