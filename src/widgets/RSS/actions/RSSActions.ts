import { SearchActions } from 'actions/reflux/SearchActions';

import IconConstants from 'constants/IconConstants';
import AccessConstants from 'constants/AccessConstants';

import { FeedItem } from '../types';
import { parseNodeContent } from '../utils';

import * as UI from 'types/ui';

interface RSSItemData {
  entry: FeedItem;
  feedUrl: string;
}

const hasLink = ({ entry }: RSSItemData) => !!entry.link;
const hasTitle = ({ entry }: RSSItemData) => !!entry.title;

const getLocation = (href: string) => {
  const match = href.match(
    /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/
  );
  return (
    match && {
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
};

const handleOpenLink: UI.ActionHandler<RSSItemData> = ({ data }) => {
  const { entry, feedUrl } = data;
  let link: string | undefined;

  if (typeof entry.link === 'string') {
    link = entry.link;
  } else if (entry.link && entry.link.attr.href && entry.link.attr.href.length > 2) {
    link = entry.link.attr.href;

    if (link[0] === '/' && link[1] !== '/') {
      // Relative paths, add the base URL (at least Github seems to use these)
      const urlLocation = getLocation(feedUrl);
      if (urlLocation) {
        link = urlLocation.protocol + '//' + urlLocation.host + link;
      }
    }
  }

  window.open(link);
};

const handleSearch: UI.ActionHandler<RSSItemData> = ({ data, location, history }) => {
  if (!data.entry.title) {
    return;
  }

  const itemInfo = {
    name: parseNodeContent(data.entry.title),
  };

  return SearchActions.search(itemInfo, location, history);
};

export const RSSActions: UI.ActionListType<RSSItemData> = {
  openLink: {
    displayName: 'Open link',
    icon: IconConstants.EXTERNAL,
    filter: hasLink,
    handler: handleOpenLink,
  },
  search: {
    displayName: 'Search',
    access: AccessConstants.SEARCH,
    icon: IconConstants.SEARCH,
    handler: handleSearch,
    filter: hasTitle,
  },
};

export default RSSActions;
