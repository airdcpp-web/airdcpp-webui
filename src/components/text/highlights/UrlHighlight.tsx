import * as API from 'types/api';
import { Location } from 'history';

import HubActions from 'actions/reflux/HubActions';
import React from 'react';
import HubSessionStore from 'stores/HubSessionStore';
import LoginStore from 'stores/LoginStore';
import { doSearch } from 'utils/SearchUtils';
import { parseMagnetLink } from 'utils/MagnetUtils';


const onClickLink = (evt: React.MouseEvent, location: Location) => {
  const uri: string = (evt.target as any).href;
  if (uri.indexOf('magnet:?xt=urn:tree:tiger:') === 0) {
    evt.preventDefault();

    if (!LoginStore.hasAccess(API.AccessEnum.SEARCH)) {
      return;
    }

    const magnet = parseMagnetLink(uri);
    if (!!magnet && !!magnet.tth) {
      doSearch(magnet.tth, location);
    }
  } else if (uri.indexOf('adc://') === 0 || uri.indexOf('adcs://') === 0 || uri.indexOf('dchub://') === 0) {
    evt.preventDefault();

    if (!LoginStore.hasAccess(API.AccessEnum.HUBS_EDIT)) {
      return;
    }

    HubActions.createSession(location, uri, HubSessionStore);
  }
};

export interface UrlHighlightProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  text: string;
  location: Location;
}

export const UrlHighlight: React.FC<UrlHighlightProps> = ({ text, location, ...other }) => (
  <a
    className="highlight url"
    href={ text }
    target="_blank"
    rel="noreferrer"
    onClick={ evt => onClickLink(evt, location)}
    { ...other }
  >
    { text }
  </a>
);
