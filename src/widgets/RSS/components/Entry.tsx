//import PropTypes from 'prop-types';
import React from 'react';

import { ActionMenu } from 'components/menu/DropdownMenu';
import RSSActions from '../actions/RSSActions';

import { formatRelativeTime } from 'utils/ValueFormat';

import '../style.css';


export interface FeedItem {
  title?: string | { content: string };
  updated?: string;
  pubDate?: string;
  guid?: string | { content: string };
  id?: string | { content: string };
}

const parseTitle = (entry: FeedItem) => {
  if (!entry.title) {
    return '(title missing)';
  }

  let title = typeof entry.title !== 'object' ? entry.title : entry.title.content;
  if (typeof title !== 'string') {
    title = '(unsupported title format)';
  }

  return title;
};

export interface EntryProps {
  entry: FeedItem;
  feedUrl: string;
  componentId: string;
}

const Entry: React.SFC<EntryProps> = ({ entry, feedUrl, componentId }) => {
  const date = entry.pubDate ? entry.pubDate : entry.updated;
  return (
    <div className="item">
      <div className="header">
        <ActionMenu 
          leftIcon={ true }
          caption={ parseTitle(entry) }
          actions={ RSSActions }
          itemData={ {
            entry,
            feedUrl,
          } }
          //contextElement={ '.' + componentId + ' .list.rss' } // TODO
        />
      </div>

      <div className="description">
        { !!date && formatRelativeTime(Date.parse(date) / 1000) }
      </div>
    </div>
  );
};

/*Entry.propTypes = {
	// Feed entry
  entry: PropTypes.shape({
    title: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    updated: PropTypes.string, // Atom feeds
    pubDate: PropTypes.string, // RSS feeds
  }),

  feedUrl: PropTypes.string.isRequired,

  componentId: PropTypes.string.isRequired,
};*/

export default Entry;