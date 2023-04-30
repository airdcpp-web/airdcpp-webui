import * as React from 'react';
import {
  Location,
  PathMatch,
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from 'react-router-dom';

import * as UI from 'types/ui';

export type ModalCloseContext = () => void;

export interface ModalCloseContextProps {
  closeModal: ModalCloseContext | undefined;
}

export const ModalRouteCloseContext = React.createContext<ModalCloseContext | undefined>(
  undefined
);

export function withModalCloseContext<PropsT>(
  Component: React.ComponentType<PropsT & ModalCloseContextProps>
) {
  return function withModalCloseContext(props: PropsT) {
    return (
      <ModalRouteCloseContext.Consumer>
        {(context) => <Component {...props} closeModal={context!} />}
      </ModalRouteCloseContext.Consumer>
    );
  };
}

const parseRoutePath = (match: PathMatch, path: string) => {
  /*if (path[0] === '/') {
    return path;
  }

  return `${match.pathname}/${path}`;*/
  return path;
};

export interface ModalRouteDecoratorChildProps {
  returnTo: string;
  params: UI.RouteParams;
  location: Location;
  handleClose: () => void;
}

export default function <PropsT>(
  Component: React.ComponentType<PropsT & ModalRouteDecoratorChildProps>,
  path: string
) {
  type Props = PropsT;

  const ModalRouteDecorator: React.FC<Props> = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const match = useMatch(location.pathname)!;
    const params = useParams()!;

    const handleClose = () => {
      // const { history, match } = this.props;
      navigate(match);
    };

    return (
      <Routes>
        <Route
          path={parseRoutePath(match, path)}
          element={
            <ModalRouteCloseContext.Provider value={handleClose}>
              <Component
                handleClose={handleClose}
                returnTo={location.pathname}
                location={location}
                params={params}
                {...props}
              />
            </ModalRouteCloseContext.Provider>
          }
        />
      </Routes>
    );
  };

  return ModalRouteDecorator;
}
