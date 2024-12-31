import * as React from 'react';

import * as API from 'types/api';

import HubActions from 'actions/reflux/HubActions';
import HubSessionStore from 'stores/HubSessionStore';

import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router';
import { AuthenticatedSession, useSession } from 'context/SessionContext';
import ExternalLink from 'components/ExternalLink';

const onClickLink = (
  evt: React.MouseEvent,
  location: Location,
  navigate: NavigateFunction,
  { hasAccess }: AuthenticatedSession,
) => {
  const uri: string = (evt.target as any).href;
  if (
    uri.startsWith('adc://') ||
    uri.startsWith('adcs://') ||
    uri.startsWith('dchub://')
  ) {
    evt.preventDefault();

    if (!hasAccess(API.AccessEnum.HUBS_EDIT)) {
      return;
    }

    HubActions.createSession(uri, {
      sessionStore: HubSessionStore,
      location,
      navigate,
    });
  }
};

export interface HighlightUrlLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  text: string;
}

export const HighlightUrlLink: React.FC<HighlightUrlLinkProps> = ({ text, ...other }) => {
  const session = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <ExternalLink
      onClick={(evt) => onClickLink(evt, location, navigate, session)}
      url={text}
    >
      {text}
    </ExternalLink>
  );
};
