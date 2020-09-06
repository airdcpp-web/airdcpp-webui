import { Location } from 'history';

import React from 'react';


export interface MeHighlightProps {
  text: string;
  location: Location;
}

export const MeHighlight: React.FC<MeHighlightProps> = ({ text, location }) => (
  <span
    className="highlight me"
  >
    { text }
  </span>
);
