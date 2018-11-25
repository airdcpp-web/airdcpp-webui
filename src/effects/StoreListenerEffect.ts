import { useEffect, useState } from 'react';


export const useStore = <StateT>(
  store: any
) => {
  const [ state, setState ] = useState<StateT>(store.getInitialState());
  useEffect(
    () => store.listen(setState),
    [ store ]
  );

  return state;
};