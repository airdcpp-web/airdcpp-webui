import * as React from 'react';
import { useEffect, useRef } from 'react';

import { useTableSelectionContext } from './SelectionContext';
import { MAX_SELECT_ALL_ITEMS } from './constants';

import * as UI from '@/types/ui';

import './style.css';

export interface SelectionHeaderCellProps {
  // Function to get total count of items (from store.rowCount)
  totalCountGetter: () => number;
  // Fetch every row in the view and select them
  onSelectAll: () => void;
  // True while the select-all fetch is in flight
  isSelectingAll?: boolean;
  t: UI.TranslateF;
}

export const SelectionHeaderCell: React.FC<SelectionHeaderCellProps> = ({
  totalCountGetter,
  onSelectAll,
  isSelectingAll = false,
  t,
}) => {
  const { selectedCount, clearSelection } = useTableSelectionContext();
  const checkboxRef = useRef<HTMLInputElement>(null);

  const totalCount = totalCountGetter();
  const hasSelection = selectedCount > 0;

  const allSelected = totalCount > 0 && selectedCount === totalCount;
  const someSelected = hasSelection && selectedCount < totalCount;

  // Select-all needs every row from the API, which is only offered for views
  // small enough to fetch and queue in one go. Clearing an existing selection
  // stays available regardless of view size.
  const selectAllAvailable =
    totalCount > 0 && totalCount <= MAX_SELECT_ALL_ITEMS && !isSelectingAll;
  const disabled = !hasSelection ? !selectAllAvailable : isSelectingAll;

  // Set indeterminate state via ref (can't be set via attribute)
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const handleChange = () => {
    if (hasSelection) {
      clearSelection();
      return;
    }

    if (selectAllAvailable) {
      onSelectAll();
    }
  };

  const getTitle = () => {
    if (hasSelection || selectAllAvailable || totalCount === 0) {
      return undefined;
    }

    return t('selectAllUnavailable', {
      defaultValue:
        'Select all is unavailable for more than {{count}} items. Narrow the view with the filters first.',
      count: MAX_SELECT_ALL_ITEMS,
    });
  };

  return (
    <div className="selection-header-cell">
      <input
        ref={checkboxRef}
        type="checkbox"
        checked={allSelected}
        disabled={disabled}
        onChange={handleChange}
        title={getTitle()}
        aria-label={
          hasSelection
            ? t('deselectAll', 'Deselect all')
            : t('selectAll', 'Select all')
        }
        className="selection-checkbox"
      />
    </div>
  );
};

export default SelectionHeaderCell;
