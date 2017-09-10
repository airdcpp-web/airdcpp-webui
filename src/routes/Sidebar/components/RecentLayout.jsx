import PropTypes from 'prop-types';
import React from 'react';

import DataProviderDecorator from 'decorators/DataProviderDecorator';
import RedrawDecorator from 'decorators/RedrawDecorator';
import ValueFormat from 'utils/ValueFormat';

import LayoutHeader from 'components/semantic/LayoutHeader';
import { ListItem } from 'components/semantic/List';

import HistoryConstants from 'constants/HistoryConstants';


const RecentLayout = DataProviderDecorator(RedrawDecorator(({ entries, entryTitleRenderer, hasSession, entryIcon }) => {
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
            description={ entry.last_opened ? ('Opened ' + ValueFormat.formatRelativeTime(entry.last_opened)) : null }
            icon={ (hasSession(entry) ? 'green ' : '') + entryIcon }
          />
        )) }
      </div>
    </div>
  );
}), {
  urls: {
    entries: ({ entryType }, socket) => socket.get(HistoryConstants.SESSIONS_URL + '/' + entryType + '/0'),
  },
});

RecentLayout.propTypes = {
  /**
	 * Title of the button
	 */
  entryIcon: PropTypes.string.isRequired,

  /**
	 * URL for fetching the recent entries
	 */
  entryType: PropTypes.string.isRequired,

  /**
	 * Renders the recent entry title
	 */
  entryTitleRenderer: PropTypes.func.isRequired,

  /**
	 * Returns whether the recent entry is currently active
	 */
  hasSession: PropTypes.func.isRequired,
};

export default RecentLayout;