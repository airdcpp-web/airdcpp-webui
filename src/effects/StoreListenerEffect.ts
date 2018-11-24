import { useEffect, useState } from 'react';


export const useStore = <SessionListType>(
  store: any
) => {
  const [ state, setState ] = useState<SessionListType | null>(null);
  useEffect(
    () => store.listen(setState),
    [ store ]
  );

  return state;
};