import invariant from 'invariant';

import * as API from 'types/api';

import { useNavigate } from 'react-router';
import { SessionLocationState } from '../types';

interface SessionRouteHelperProps {
  baseUrl: string;
}

export const useSessionRouteHelpers = ({ baseUrl }: SessionRouteHelperProps) => {
  const navigate = useNavigate();

  // HELPERS
  const getSessionUrl = (id: API.IdType) => {
    invariant(!!id, 'Trying to get session URL without a session');
    return `/${baseUrl}/session/${id}`;
  };

  const pushSession = (id: API.IdType) => {
    navigate(getSessionUrl(id));
  };

  const replaceSession = (id: API.IdType, state?: SessionLocationState) => {
    navigate(getSessionUrl(id), { replace: true, state });
  };

  const newUrl = `/${baseUrl}/new`;
  const replaceNew = () => {
    // const { navigate } = props;
    navigate(newUrl, { replace: true });
  };

  return {
    newUrl: `/${baseUrl}/new`,
    replaceNew,

    getSessionUrl,
    pushSession,
    replaceSession,
  };
};
