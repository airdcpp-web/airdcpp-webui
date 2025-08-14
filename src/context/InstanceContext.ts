import { getRandomInt } from '@/utils/ValueUtils';
import { createContext, useContext } from 'react';

// Create separate context for each test instance
// Tests within the same file can share state if they are run in parallel
// which will affect at least the modal dialogs
//
// Provider is not needed in the production code
export type UIInstanceId = number | null;
export type UIInstanceContextType = UIInstanceId;
export const UIInstanceContext = createContext<UIInstanceContextType>(null);

export const useUIInstance = () => {
  return useContext(UIInstanceContext);
};

export const generateInstanceId = () => {
  return getRandomInt(0, Number.MAX_SAFE_INTEGER);
};

export const appendInstanceId = (id: string, instanceId: number | null) => {
  if (instanceId === null) {
    return id;
  }

  return `${id}_${instanceId}`;
};
