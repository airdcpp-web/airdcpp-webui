import * as React from 'react';

import Checkbox from '@/components/semantic/Checkbox';
import { useTableSelectionContext } from './SelectionContext';
import { RowWrapperCellChildProps } from '@/components/table/RowWrapperCell';
import { SelectableItem } from './types';

export interface SelectionCheckboxCellProps
  extends RowWrapperCellChildProps<any, SelectableItem> {}

export const SelectionCheckboxCell: React.FC<SelectionCheckboxCellProps> = ({
  rowDataGetter,
}) => {
  const { isSelected, toggleItem } = useTableSelectionContext();
  const rowData = rowDataGetter?.();

  if (!rowData) {
    return null;
  }

  const handleChange = (checked: boolean) => {
    // Pass the full row data for caching - this ensures the item data is
    // preserved even when it leaves the sparse store
    toggleItem(rowData.id, rowData);
  };

  return (
    <Checkbox
      checked={isSelected(rowData.id)}
      onChange={handleChange}
    />
  );
};

export default SelectionCheckboxCell;
