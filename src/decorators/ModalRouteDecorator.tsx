import * as React from 'react';
import {
  Location,
  Params,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router';

export type ModalCloseContext = () => void;

export interface ModalCloseContextProps {
  closeModal: ModalCloseContext | undefined;
}

export const ModalRouteCloseContext = React.createContext<ModalCloseContext | undefined>(
  undefined,
);

export interface ModalRouteDecoratorChildProps {
  location: Location;
  handleClose: () => Promise<void>;
  params: Readonly<Params<string>>;
}

interface ParamsProviderProps<PropsT extends object>
  extends Omit<ModalRouteDecoratorChildProps, 'params'> {
  component: React.ComponentType<PropsT & ModalRouteDecoratorChildProps>;
}

const RouteParamsProvider = <PropsT extends object>({
  component: Component,
  ...other
}: ParamsProviderProps<PropsT>) => {
  const params = useParams();
  return (
    <Component
      params={params}
      {...(other as PropsT & Omit<ModalRouteDecoratorChildProps, 'params'>)}
    />
  );
};

const useRouteModalReturn = (location: Location) => {
  const navigate = useNavigate();
  const params = useParams()!;

  const handleClose = async () => {
    const modalPath = params['*'];
    if (modalPath) {
      const index = location.pathname.lastIndexOf(modalPath);
      const parentPath = location.pathname.substring(0, index - 1);
      await navigate(parentPath);
    }
  };

  return handleClose;
};

export default function <PropsT extends object>(
  Component: React.ComponentType<PropsT & ModalRouteDecoratorChildProps>,
  path: string,
) {
  type Props = PropsT;

  const ModalRouteDecorator: React.FC<Props> = (props) => {
    const location = useLocation();
    const handleClose = useRouteModalReturn(location);
    return (
      <Routes>
        <Route
          path={`${path}/*`}
          element={
            <ModalRouteCloseContext.Provider value={handleClose}>
              <RouteParamsProvider
                component={Component}
                handleClose={handleClose}
                location={location}
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
