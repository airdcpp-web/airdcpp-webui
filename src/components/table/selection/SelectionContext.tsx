import { createContext, useContext } from 'react';

import { TableSelectionContextValue } from './types';

const TableSelectionContext = createContext<TableSelectionContextValue | null>(null);

export const useTableSelectionContext = (): TableSelectionContextValue => {
  const context = useContext(TableSelectionContext);
  if (!context) {
    throw new Error(
      'useTableSelectionContext must be used within a TableSelectionProvider'
    );
  }
  return context;
};

export const useTableSelectionContextOptional = (): TableSelectionContextValue | null => {
  return useContext(TableSelectionContext);
};

export const TableSelectionProvider = TableSelectionContext.Provider;

export default TableSelectionContext;
