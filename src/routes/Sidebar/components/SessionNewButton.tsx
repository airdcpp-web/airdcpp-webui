import * as React from 'react';
import classNames from 'classnames';

import IconConstants from '@/constants/IconConstants';
import RouterMenuItemLink from '@/components/semantic/RouterMenuItemLink';

interface SessionNewButtonProps {
  url: string;
  title: React.ReactNode;
  className?: string;
}

const SessionNewButton: React.FC<SessionNewButtonProps> = ({
  url,
  title,
  // pushNew,
  className,
}) => (
  <RouterMenuItemLink
    key="button-new"
    className={classNames('new', className)}
    icon={IconConstants.CREATE}
    url={url}
  >
    {title}
  </RouterMenuItemLink>
);

export default SessionNewButton;
