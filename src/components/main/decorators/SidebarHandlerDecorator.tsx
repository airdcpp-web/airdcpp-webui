import React, { memo } from 'react';

import { Location } from 'history';

import { RouteItem } from 'routes/Routes';
import { useSidebarEffect } from 'effects';
import { RouteComponentProps } from 'react-router';


// A decorator for handling of sidebar
// This should be used with main layouts that are displayed only when socket is connected


export type SidebarHandlerDecoratorProps = RouteComponentProps;

export interface SidebarHandlerDecoratorChildProps extends RouteComponentProps {
  previousLocation?: Location;
}

export default function <PropsT>(
  Component: React.ComponentType<PropsT & SidebarHandlerDecoratorChildProps>,
  sidebarRoutes: RouteItem[]
) {
  const SidebarHandlerDecorator: React.SFC<PropsT & SidebarHandlerDecoratorProps> = (props) => {
    const previousLocation = useSidebarEffect(sidebarRoutes, props);
    return (
      <Component 
        { ...props }
        previousLocation={ previousLocation }
      />
    );
  };

  return memo(SidebarHandlerDecorator);
}
