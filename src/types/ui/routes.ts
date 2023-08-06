import { LazyRouteFunction, RouteObject } from 'react-router';
import { UnreadInfoStore } from './urgencies';

export type RouteItemClickHandler = (
  path: string,
  event: React.SyntheticEvent<any>,
) => void;

export interface RouteItem {
  title: string;
  path: string;
  matchPath?: string;
  icon: string;
  unreadInfoStore?: UnreadInfoStore;
  access?: string;
  // component?: React.ComponentType;
  className?: string;
  onClick?: RouteItemClickHandler;
  lazy?: LazyRouteFunction<RouteObject>;
  children?: RouteObject[];
}
