//import PropTypes from 'prop-types';
import React from 'react';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
//import RedrawDecorator from 'decorators/RedrawDecorator';
import { formatRelativeTime } from 'utils/ValueFormat';

import LayoutHeader from 'components/semantic/LayoutHeader';
import { ListItem } from 'components/semantic/List';

import HistoryConstants from 'constants/HistoryConstants';

import * as API from 'types/api';


interface RecentLayoutProps {
  entryIcon: string;
  entryType: string;
  entryTitleRenderer: (entry: API.HistoryItem) => React.ReactNode;
  hasSession: (entry: API.HistoryItem) => boolean;
}

interface DataProps {
  entries: API.HistoryItem[];
}

type Props = RecentLayoutProps & DataProps & DataProviderDecoratorChildProps;

const RecentLayout: React.SFC<Props> = ({ entries, entryTitleRenderer, hasSession, entryIcon }) => {
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="recents">
      <LayoutHeader
        title="Recent sessions"
        size="medium"
      />
      <div className="ui relaxed divided list">
        { entries.map((entry, index) => (
          <ListItem 
            key={ index }
            header={ entryTitleRenderer(entry) }
            description={ entry.last_opened ? (`Opened ${formatRelativeTime(entry.last_opened)}`) : null }
            icon={ (hasSession(entry) ? 'green ' : '') + entryIcon }
          />
        )) }
      </div>
    </div>
  );
};

/*RecentLayout.propTypes = {
  // Title of the button
  entryIcon: PropTypes.string.isRequired,

  // URL for fetching the recent entries
  entryType: PropTypes.string.isRequired,

  // Renders the recent entry title
  entryTitleRenderer: PropTypes.func.isRequired,

  // Returns whether the recent entry is currently active
  hasSession: PropTypes.func.isRequired,
};*/

export default DataProviderDecorator<RecentLayoutProps, DataProps>(
  //RedrawDecorator<Props>(RecentLayout),
  RecentLayout,
  {
    urls: {
      entries: ({ entryType }, socket) => socket.get(`${HistoryConstants.SESSIONS_URL}/${entryType}/0`),
    },
  }
);