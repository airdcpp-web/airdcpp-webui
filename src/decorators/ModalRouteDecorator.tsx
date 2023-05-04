import * as React from 'react';
import {
  Location,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

export type ModalCloseContext = () => void;

export interface ModalCloseContextProps {
  closeModal: ModalCloseContext | undefined;
}

export const ModalRouteCloseContext = React.createContext<ModalCloseContext | undefined>(
  undefined
);

export interface ModalRouteDecoratorChildProps {
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
    const params = useParams()!;

    const handleClose = () => {
      const modalPath = params['*'];
      if (modalPath) {
        const index = location.pathname.lastIndexOf(modalPath);
        const parentPath = location.pathname.substring(0, index - 1);
        navigate(parentPath);
      }
    };

    return (
      <Routes>
        <Route
          path={`${path}/*`}
          element={
            <ModalRouteCloseContext.Provider value={handleClose}>
              <Component
                handleClose={handleClose}
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
