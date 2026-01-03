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
    toggleItem(rowData.id);
  };

  return (
    <Checkbox
      checked={isSelected(rowData.id)}
      onChange={handleChange}
    />
  );
};

export default SelectionCheckboxCell;
