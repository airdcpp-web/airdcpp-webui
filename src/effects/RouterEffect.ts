import { useContext } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import * as H from 'history';

//@ts-ignore
import { __RouterContext } from 'react-router';

// FIXME:  use official API when https://github.com/ReactTraining/react-router/pull/6453 merged

export function useRouter<
  Params extends { [K in keyof Params]?: string } = {}, 
  C extends StaticContext = StaticContext, 
  S = H.LocationState
>() {
  //const tmp = R;
  const router = useContext(__RouterContext) as RouteComponentProps<Params, C, S>;
  return router;
}
