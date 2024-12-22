import * as React from 'react';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';
//import RedrawDecorator from 'decorators/RedrawDecorator';
import { useFormatter } from 'context/FormatterContext';

import LayoutHeader from 'components/semantic/LayoutHeader';
import { ListItem } from 'components/semantic/List';

import HistoryConstants from 'constants/HistoryConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { translate, toI18nKey } from 'utils/TranslationUtils';
import { useTranslation } from 'react-i18next';

interface RecentLayoutProps {
  // Title of the button
  entryIcon: string;

  // URL for fetching the recent entries
  entryType: string;

  // Renders the recent entry title
  entryTitleRenderer: (entry: API.HistoryItem) => React.ReactNode;

  // Returns whether the recent entry is currently active
  hasSession: (entry: API.HistoryItem) => boolean;
}

interface DataProps {
  entries: API.HistoryItem[];
}

type Props = RecentLayoutProps & DataProps & DataProviderDecoratorChildProps;

const RecentLayout: React.FC<Props> = ({
  entries,
  entryTitleRenderer,
  hasSession,
  entryIcon,
}) => {
  const { formatRelativeTime } = useFormatter();
  const { t } = useTranslation();
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="recents">
      <LayoutHeader title={translate('Recent sessions', t, UI.Modules.COMMON)} size="" />
      <div className="ui relaxed divided list">
        {entries.map((entry, index) => (
          <ListItem
            key={index}
            header={entryTitleRenderer(entry)}
            description={
              !!entry.last_opened &&
              t(toI18nKey('openedAgo', UI.Modules.COMMON), {
                defaultValue: 'Opened {{timeAgo}}',
                replace: {
                  timeAgo: formatRelativeTime(entry.last_opened),
                },
              })
            }
            icon={(hasSession(entry) ? 'green ' : '') + entryIcon}
          />
        ))}
      </div>
    </div>
  );
};

export default DataProviderDecorator<RecentLayoutProps, DataProps>(
  //RedrawDecorator<Props>(RecentLayout),
  RecentLayout,
  {
    urls: {
      entries: ({ entryType }, socket) =>
        socket.get(`${HistoryConstants.SESSIONS_URL}/${entryType}/0`),
    },
  },
);
