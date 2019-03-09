import { createContext } from 'react';


export type InstallPromptContextType = (() => void) | null;
export const InstallPromptContext = createContext<InstallPromptContextType>(null);