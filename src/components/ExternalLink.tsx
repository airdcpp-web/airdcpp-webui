import * as React from 'react';

const hasScheme = (u: string) =>
  /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(u) || u.startsWith('//');
const isEmail = (u: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u);
const isUnsafeScheme = (u: string) => /^(javascript|data|vbscript):/i.test(u);

const normalizeUrl = (raw: string, defaultProtocol: 'http' | 'https' = 'https') => {
  const url = raw.trim();
  if (!url) return '#';

  // Keep in-app routes and fragments
  if (url.startsWith('/') || url.startsWith('#')) return url;

  // Already has a scheme or is protocol-relative
  if (hasScheme(url)) {
    return isUnsafeScheme(url) ? '#' : url;
  }

  // Email without scheme
  if (isEmail(url)) return `mailto:${url}`;

  // Fallback to web URL
  return `${defaultProtocol}://${url}`;
};

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
    href={normalizeUrl(url)}
    target="_blank"
    rel="noopener noreferrer"
    {...other}
  >
    {children}
  </a>
);

export default ExternalLink;
