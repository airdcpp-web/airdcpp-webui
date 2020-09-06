import { Location } from 'history';

import React from 'react';
import { doSearch } from 'utils/SearchUtils';


export interface ReleaseHighlightProps {
  text: string;
  location: Location;
}

export const ReleaseHighlight: React.FC<ReleaseHighlightProps> = ({ text, location }) => (
  <a
    className="highlight release"
    onClick={() => {
      doSearch(text, location);
    }}
  >
    { text }
  </a>
);
