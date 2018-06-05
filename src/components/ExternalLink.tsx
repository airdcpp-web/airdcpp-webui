'use strict';

import React from 'react';


interface ExternalLinkProps {
  url: string;
  className?: string;
}

const ExternalLink: React.SFC<ExternalLinkProps> = ({ url, children, className = '' }) => (
  <a 
    className={ className }
    href={ url } 
    target="_blank"
    rel="noopener noreferrer"
  >
    { children }
  </a>
);

export default ExternalLink;