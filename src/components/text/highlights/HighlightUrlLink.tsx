import * as React from 'react';

import * as API from 'types/api';

import { Location } from 'history';

import HubActions from 'actions/reflux/HubActions';
import HubSessionStore from 'stores/HubSessionStore';

import LoginStore from 'stores/LoginStore';

const onClickLink = (evt: React.MouseEvent, location: Location) => {
  const uri: string = (evt.target as any).href;
  if (
    uri.indexOf('adc://') === 0 ||
    uri.indexOf('adcs://') === 0 ||
    uri.indexOf('dchub://') === 0
  ) {
    evt.preventDefault();

    if (!LoginStore.hasAccess(API.AccessEnum.HUBS_EDIT)) {
      return;
    }

    HubActions.createSession(location, uri, HubSessionStore);
  }
};

export interface HighlightUrlLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  text: string;
  location: Location;
}

export const HighlightUrlLink: React.FC<HighlightUrlLinkProps> = ({
  text,
  location,
  ...other
}) => (
  <a
    className="highlight url link"
    href={text}
    target="_blank"
    rel="noreferrer"
    onClick={(evt) => onClickLink(evt, location)}
    {...other}
  >
    {text}
  </a>
);
