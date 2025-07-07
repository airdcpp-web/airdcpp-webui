import { createFormatter } from '@/utils/Formatter';
import { createContext, useContext } from 'react';

export type Formatter = ReturnType<typeof createFormatter>;

export const FormatterContext = createContext<Formatter>({} as Formatter);

export const useFormatter = () => {
  return useContext(FormatterContext);
};
