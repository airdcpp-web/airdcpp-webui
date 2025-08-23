import * as React from 'react';
import CountLabel, { CountLabelProps } from '@/components/CountLabel';
import classNames from 'classnames';
import Icon from '@/components/semantic/Icon';
import IconConstants from '@/constants/IconConstants';

interface MenuIconProps extends Pick<CountLabelProps, 'urgencies'> {
  className?: string;
  onClick?: (evt: React.SyntheticEvent<any>) => void;
  label: string;
}

// A plain menu icon trigger for dropdowns (with urgency label support)
const MenuIcon: React.FC<MenuIconProps> = ({ urgencies, className, onClick, label }) => (
  <div
    className={classNames('icon-menu', className)}
    aria-label={label}
    onClick={onClick}
  >
    <Icon icon={IconConstants.MENU} onClick={onClick} />
    <CountLabel urgencies={urgencies} size="mini" empty={true} circular={true} />
  </div>
);

export { MenuIcon };
