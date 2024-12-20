import * as React from 'react';

import * as API from 'types/api';

import HubActions from 'actions/reflux/HubActions';
import HubSessionStore from 'stores/HubSessionStore';

import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router';
import { AuthenticatedSession, useSession } from 'context/SessionContext';

const onClickLink = (
  evt: React.MouseEvent,
  location: Location,
  navigate: NavigateFunction,
  { hasAccess }: AuthenticatedSession,
) => {
  const uri: string = (evt.target as any).href;
  if (
    uri.indexOf('adc://') === 0 ||
    uri.indexOf('adcs://') === 0 ||
    uri.indexOf('dchub://') === 0
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
    <a
      className="highlight url link"
      href={text}
      target="_blank"
      rel="noreferrer"
      onClick={(evt) => onClickLink(evt, location, navigate, session)}
      {...other}
    >
      {text}
    </a>
  );
};
