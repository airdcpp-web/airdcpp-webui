import { memo, useState, useEffect, useCallback } from 'react';

import TableFilterDecorator, {
  TableFilterDecoratorChildProps,
  TableFilterDecoratorProps,
} from '@/decorators/TableFilterDecorator';

import * as API from '@/types/api';

import Button from '@/components/semantic/Button';
import IconConstants from '@/constants/IconConstants';
import { useTranslation } from 'react-i18next';

import './DupeFilterToggles.css';

export interface DupeFilterTogglesProps {}

type Props = DupeFilterTogglesProps & TableFilterDecoratorChildProps;

// Build regex pattern to exclude dupes based on toggles
// Dupe IDs: share_partial, share_full, queue_partial, queue_full,
// finished_partial, finished_full, share_queue, queue_finished,
// share_finished, share_queue_finished
const buildFilterPattern = (hideShared: boolean, hideQueued: boolean): string => {
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

const DupeFilterToggles = memo<Props>(function DupeFilterToggles({ onFilterUpdated }) {
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

  return (
    <div className="dupe-filter-toggles">
      <Button
        className={`mini ${hideShared ? 'active' : ''}`}
        icon={IconConstants.FOLDER}
        caption={t('table.filter.hideShared', 'Hide shared')}
        onClick={toggleHideShared}
      />
      <Button
        className={`mini ${hideQueued ? 'active' : ''}`}
        icon={IconConstants.QUEUE_PLAIN}
        caption={t('table.filter.hideQueued', 'Hide queued')}
        onClick={toggleHideQueued}
      />
    </div>
  );
});

export default TableFilterDecorator<DupeFilterTogglesProps & TableFilterDecoratorProps>(
  DupeFilterToggles,
  'dupe',
);
