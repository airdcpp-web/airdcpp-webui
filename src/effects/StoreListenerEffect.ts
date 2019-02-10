import { useEffect, useState } from 'react';


export const useStore = <StateT>(
  store: any,
  initFunction?: () => void
) => {
  if (initFunction) {
    initFunction();
  }

  const [ state, setState ] = useState<StateT>(store.getInitialState());
  useEffect(
    () => store.listen(setState),
    [ store ]
  );

  return state;
};