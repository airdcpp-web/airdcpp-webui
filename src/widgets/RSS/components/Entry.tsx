import * as React from 'react';

import { ActionMenu } from 'components/action-menu';

import RSSActions from '../actions/RSSActions';
import { FeedItem } from '../types';
import { parseNodeContent } from '../utils';

import * as UI from 'types/ui';
import { useFormatter } from 'context/FormatterContext';

const parseTitle = (entry: FeedItem) => {
  if (!entry.title) {
    return '(title missing)';
  }

  let title = parseNodeContent(entry.title);
  if (typeof title !== 'string') {
    title = '(unsupported title format)';
  }

  return title;
};

export interface EntryProps extends Pick<UI.WidgetProps, 'widgetT' | 'componentId'> {
  entry: FeedItem;
  feedUrl: string;
}

const Entry: React.FC<EntryProps> = ({ entry, feedUrl, widgetT }) => {
  const { formatRelativeTime } = useFormatter();
  const date = entry.pubDate ? entry.pubDate : entry.updated;
  return (
    <div className="item">
      <div className="header">
        <ActionMenu
          leftIcon={true}
          caption={parseTitle(entry)}
          actions={{
            actions: RSSActions,
            moduleData: {
              moduleId: widgetT.moduleId,
            },
          }}
          itemData={{
            id: feedUrl,
            entry,
            feedUrl,
          }}
          //contextElement={ '.' + componentId + ' .list.rss' } // TODO
        />
      </div>

      <div className="description">
        {!!date && formatRelativeTime(Date.parse(parseNodeContent(date)) / 1000)}
      </div>
    </div>
  );
};

export default Entry;
