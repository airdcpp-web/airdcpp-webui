import { useEffect, useState } from 'react';

export const useStore = <StateT>(
  store: any | undefined,
  calculateState?: (store: any) => StateT
) => {
  if (!store && !calculateState) {
    throw new Error('Either "store" or "calculateState" must be present');
  }

  const [state, setState] = useState<StateT>(
    !!calculateState ? calculateState(store) : store!.getInitialState()
  );
  useEffect(() => {
    if (!!store) {
      setState(!!calculateState ? calculateState(store) : store!.getInitialState());
      return store.listen((data: StateT) => {
        setState(!!calculateState ? calculateState(store) : data);
      });
    }
  }, [store]);

  return state;
};
