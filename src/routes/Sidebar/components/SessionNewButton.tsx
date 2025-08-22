import * as React from 'react';
import classNames from 'classnames';

import IconConstants from '@/constants/IconConstants';
import RouterMenuItemLink, {
  RouterMenuItemLinkProps,
} from '@/components/semantic/RouterMenuItemLink';

interface SessionNewButtonProps extends Omit<RouterMenuItemLinkProps, 'url' | 'title'> {
  url: string;
  title: string;
  className?: string;
}

const SessionNewButton: React.FC<SessionNewButtonProps> = ({
  url,
  title,
  className,
  ...other
}) => (
  <RouterMenuItemLink
    key="button-new"
    className={classNames('new', className)}
    icon={IconConstants.CREATE}
    url={url}
    {...other}
  >
    {title}
  </RouterMenuItemLink>
);

export default SessionNewButton;
