import { memo, useState, useEffect, useCallback } from 'react';
import * as React from 'react';

import TableFilterDecorator, {
  TableFilterDecoratorChildProps,
  TableFilterDecoratorProps,
} from '@/decorators/TableFilterDecorator';

import * as API from '@/types/api';

import Button from '@/components/semantic/Button';
import Popup from '@/components/semantic/Popup';
import Icon from '@/components/semantic/Icon';
import IconConstants from '@/constants/IconConstants';
import { useTranslation } from 'react-i18next';

import './DupeFilterToggles.css';

// Build regex pattern to exclude dupes based on toggles
// Dupe IDs: share_partial, share_full, queue_partial, queue_full,
// finished_partial, finished_full, share_queue, queue_finished,
// share_finished, share_queue_finished
export const buildFilterPattern = (hideShared: boolean, hideQueued: boolean): string => {
  if (!hideShared && !hideQueued) {
    return ''; // No filter - show all
  }

  // Build negative lookahead pattern
  const excludePatterns: string[] = [];

  if (hideShared) {
    // Exclude anything starting with "share" or containing "share"
    excludePatterns.push('share');
  }

  if (hideQueued) {
    // Exclude anything containing "queue"
    excludePatterns.push('queue');
  }

  // Pattern matches empty string (no dupe) OR strings not containing excluded terms
  // Using negative lookahead with full string match: ^(?!.*(share|queue)).*$
  return `^(?!.*(${excludePatterns.join('|')})).*$`;
};

interface FilterOptionsPopupContentProps {
  hideShared: boolean;
  hideQueued: boolean;
  onToggleShared: () => void;
  onToggleQueued: () => void;
}

const FilterOptionsPopupContent: React.FC<FilterOptionsPopupContentProps> = ({
  hideShared,
  hideQueued,
  onToggleShared,
  onToggleQueued,
}) => {
  const { t } = useTranslation();

  return (
    <div className="dupe-filter-toggles popup-content">
      <Button
        className={`mini ${hideShared ? 'active' : ''}`}
        icon={IconConstants.FOLDER}
        caption={t('table.filter.hideShared', 'Hide shared')}
        onClick={onToggleShared}
      />
      <Button
        className={`mini ${hideQueued ? 'active' : ''}`}
        icon={IconConstants.QUEUE_PLAIN}
        caption={t('table.filter.hideQueued', 'Hide queued')}
        onClick={onToggleQueued}
      />
    </div>
  );
};

const FilterOptionsButton = memo<TableFilterDecoratorChildProps>(function FilterOptionsButton({
  onFilterUpdated,
}) {
  const { t } = useTranslation();
  const [hideShared, setHideShared] = useState(false);
  const [hideQueued, setHideQueued] = useState(false);

  // Update filter when toggles change
  useEffect(() => {
    const pattern = buildFilterPattern(hideShared, hideQueued);
    onFilterUpdated(pattern, API.FilterMethod.REGEX);
  }, [hideShared, hideQueued, onFilterUpdated]);

  const toggleHideShared = useCallback(() => {
    setHideShared((prev) => !prev);
  }, []);

  const toggleHideQueued = useCallback(() => {
    setHideQueued((prev) => !prev);
  }, []);

  // Calculate active filter count for badge
  const filterCount = (hideShared ? 1 : 0) + (hideQueued ? 1 : 0);

  return (
    <Popup
      triggerClassName="filter-options"
      className="filter-options"
      trigger={
        <Button
          className="mini"
          caption={
            <>
              <Icon icon={IconConstants.FILTER} />
              {!!filterCount && (
                <span
                  style={{
                    fontWeight: 'bold',
                    marginLeft: '3px',
                  }}
                >
                  {`(${filterCount})`}
                </span>
              )}
              <Icon icon={IconConstants.EXPAND} />
            </>
          }
          title={t('table.filter.options', 'Filter options')}
          aria-label={t('table.filter.openOptions', 'Open filter options')}
        />
      }
      contentUpdateTrigger={`${hideShared}-${hideQueued}`}
    >
      {() => (
        <FilterOptionsPopupContent
          hideShared={hideShared}
          hideQueued={hideQueued}
          onToggleShared={toggleHideShared}
          onToggleQueued={toggleHideQueued}
        />
      )}
    </Popup>
  );
});

export default TableFilterDecorator<TableFilterDecoratorProps>(FilterOptionsButton, 'dupe');
