import React from 'react';
import { Route, match as RouteMatch, withRouter, RouteComponentProps } from 'react-router-dom';


export type ModalCloseContext = () => void;

export interface ModalCloseContextProps {
  closeModal: ModalCloseContext;
}

export const ModalRouteCloseContext = React.createContext<ModalCloseContext | undefined>(undefined);

export function withModalCloseContext<PropsT>(Component: React.ComponentType<PropsT & ModalCloseContextProps>) {
  return (props: PropsT) => {
    return (
      <ModalRouteCloseContext.Consumer>
        { context => <Component {...props} closeModal={ context! } /> }
      </ModalRouteCloseContext.Consumer>
    );
  };
}




const parseRoutePath = (match: RouteMatch<{}>, path: string) => {
  if (path[0] === '/') {
    return path;
  }

  return `${match.url}/${path}`;
};

export interface ModalRouteDecoratorProps {
  
}

export interface ModalRouteDecoratorChildProps extends RouteComponentProps {
  returnTo: string;
}

export default function <PropsT>(
  Component: React.ComponentType<PropsT & ModalRouteDecoratorChildProps>, 
  path: string
) {
  class ModalRouteDecorator extends React.Component<PropsT & ModalRouteDecoratorProps & RouteComponentProps> {
    handleClose = () => {
      const { history, match } = this.props;
      history.replace(match.url);
    }

    render() {
      const { match } = this.props;
      return (
        <Route 
          path={ parseRoutePath(match, path) }
          render={ routeProps => (
            <ModalRouteCloseContext.Provider value={ this.handleClose }>
              <Component
                returnTo={ match.url }
                { ...this.props }
                { ...routeProps }
              />
            </ModalRouteCloseContext.Provider>
          ) }
        />
      );
    }
  }

  return withRouter(ModalRouteDecorator);
}