import { createContext } from 'react';


export type LayoutWidthContextType = number | null;
export const LayoutWidthContext = createContext<LayoutWidthContextType>(null);