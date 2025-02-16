import IconConstants from 'constants/IconConstants';

import { FeedItem } from '../types';
import { parseNodeContent } from '../utils';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { searchStringForeground } from 'utils/SearchUtils';

interface RSSItemData {
  id: string;
  entry: FeedItem;
  feedUrl: string;
}

type Filter = UI.ActionFilter<RSSItemData>;

const hasLink: Filter = ({ itemData }) => !!itemData.entry.link;
const hasTitle: Filter = ({ itemData }) => !!itemData.entry.title;

const getLocation = (href: string) => {
  const match = href.match(
    /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/,
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

type Handler = UI.ActionHandler<RSSItemData>;
const handleOpenLink: Handler = ({ itemData }) => {
  const { entry, feedUrl } = itemData;
  let link: string | undefined;

  if (typeof entry.link === 'string') {
    link = entry.link;
  } else if (entry?.link?.attr.href && entry.link.attr.href.length > 2) {
    link = entry.link.attr.href;

    if (link.startsWith('//')) {
      // Relative paths, add the base URL (at least Github seems to use these)
      const urlLocation = getLocation(feedUrl);
      if (urlLocation) {
        link = urlLocation.protocol + '//' + urlLocation.host + link;
      }
    }
  }

  window.open(link);
};

const handleSearch: Handler = ({ itemData, location, navigate }) => {
  if (!itemData.entry.title) {
    return;
  }

  const searchString = parseNodeContent(itemData.entry.title);
  return searchStringForeground(searchString, location, navigate);
};

export const RSSActions: UI.ActionListType<RSSItemData> = {
  openLink: {
    id: 'openLink',
    displayName: 'Open link',
    icon: IconConstants.EXTERNAL,
    filter: hasLink,
    handler: handleOpenLink,
  },
  search: {
    id: 'search',
    displayName: 'Search',
    access: API.AccessEnum.SEARCH,
    icon: IconConstants.SEARCH,
    handler: handleSearch,
    filter: hasTitle,
  },
};

export default RSSActions;
