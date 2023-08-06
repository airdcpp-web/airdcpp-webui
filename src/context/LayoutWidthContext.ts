import { createContext, useContext } from 'react';

export type LayoutWidthContextType = number | null;
export const LayoutWidthContext = createContext<LayoutWidthContextType>(null);

export const useLayoutWidth = () => {
  return useContext(LayoutWidthContext);
};
