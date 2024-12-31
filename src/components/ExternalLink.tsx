import * as React from 'react';

type ExternalLinkProps = React.PropsWithChildren<{
  url: string;
  className?: string;
}> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

const ExternalLink: React.FC<ExternalLinkProps> = ({
  url,
  children,
  className = '',
  ...other
}) => (
  <a
    className={className}
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    {...other}
  >
    {children}
  </a>
);

export default ExternalLink;
