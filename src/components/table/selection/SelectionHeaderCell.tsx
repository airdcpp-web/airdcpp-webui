import * as React from 'react';
import { useEffect, useRef } from 'react';

import { useTableSelectionContext } from './SelectionContext';

import './style.css';

export interface SelectionHeaderCellProps {
  // Function to get total count of items (from store.rowCount)
  totalCountGetter: () => number;
}

export const SelectionHeaderCell: React.FC<SelectionHeaderCellProps> = ({ totalCountGetter }) => {
  const { selectAllMode, excludedIds, selectedIds, setSelectAllMode } = useTableSelectionContext();
  const checkboxRef = useRef<HTMLInputElement>(null);

  // Get current total count
  const totalCount = totalCountGetter();

  // Determine checkbox state
  // All selected if: selectAllMode with no exclusions, OR all items manually selected
  const allSelected = totalCount > 0 && (
    (selectAllMode && excludedIds.size === 0) ||
    (!selectAllMode && selectedIds.size === totalCount)
  );
  // Some selected if: some but not all items are selected
  const someSelected = selectAllMode
    ? excludedIds.size > 0 && excludedIds.size < totalCount
    : selectedIds.size > 0 && selectedIds.size < totalCount;

  // Set indeterminate state via ref (can't be set via attribute)
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const handleChange = () => {
    if (selectAllMode) {
      // Currently in select-all mode, turn it off (deselect all)
      setSelectAllMode(false, 0);
    } else {
      // Enter select-all mode - get fresh count when clicking
      const currentCount = totalCountGetter();
      setSelectAllMode(true, currentCount);
    }
  };

  return (
    <div className="selection-header-cell">
      <input
        ref={checkboxRef}
        type="checkbox"
        checked={allSelected}
        onChange={handleChange}
        aria-label={allSelected ? 'Deselect all' : 'Select all'}
        className="selection-checkbox"
      />
    </div>
  );
};

export default SelectionHeaderCell;
