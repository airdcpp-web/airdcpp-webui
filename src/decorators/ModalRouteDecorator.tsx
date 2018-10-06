import React from 'react';
import { Route, match as RouteMatch, withRouter, RouteComponentProps } from 'react-router';
import History from 'utils/History';


const parseRoutePath = (match: RouteMatch<{}>, path: string) => {
  if (path[0] === '/') {
    return path;
  }

  return `${match.url}/${path}`;
};


export interface ModalRouteDecoratorProps {
  
}


export const ModalRouteCloseContext = React.createContext<() => void>(() => { return undefined; });

export interface ModalRouteDecoratorChildProps {
  returnTo: string;
}

export default function <PropsT>(
  Component: React.ComponentType<PropsT & ModalRouteDecoratorChildProps>, 
  path: string
) {
  class ModalRouteDecorator extends React.Component<PropsT & ModalRouteDecoratorProps & RouteComponentProps> {
    render() {
      const { match } = this.props;
      return (
        <Route 
          path={ parseRoutePath(match, path) }
          render={ routeProps => (
            <ModalRouteCloseContext.Provider value={ () => History.replace(match.url) }>
              <Component
                returnTo={ match.url }
                { ...this.props }
                { ...routeProps }
              />
            </ModalRouteCloseContext.Provider>
          ) }
          //{ ...props }
        />
      );
    }
  }

  /*const ModalRouteDecorator: React.SFC<ModalRouteDecoratorProps & PropsT> = (
    props, 
    { router }: RouterChildContext<{}>
  ) => {
    const { match } = router.route;
    return (
      <Route 
        path={ parseRoutePath(match, path) }
        render={ routeProps => (
          <ModalRouteCloseContext.Provider value={ () => History.replace(match.url) }>
            <Component
              returnTo={ match.url }
              { ...props }
              { ...routeProps }
            />
          </ModalRouteCloseContext.Provider>
        ) }
        { ...props }
      />
    );
  };*/

  /*ModalRouteDecorator.contextTypes = {
    router: PropTypes.object.isRequired,
  };*/

  return withRouter(ModalRouteDecorator);
}