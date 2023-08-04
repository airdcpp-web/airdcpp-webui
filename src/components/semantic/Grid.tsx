import * as React from 'react';
import classNames from 'classnames';

import { Trans } from 'react-i18next';
import { toI18nKey } from 'utils/TranslationUtils';

import * as UI from 'types/ui';

export interface RowProps {
  title: React.ReactNode;
  text?: React.ReactNode;
  titleWidth?: string;
  className?: string;
  noText?: boolean;
}

const formatText = (text: React.ReactNode) => {
  if (!!text) {
    return text;
  }

  return <Trans i18nKey={toI18nKey('na', UI.Modules.COMMON)}>N/A</Trans>;
};

export const Row: React.FC<RowProps> = ({
  title,
  text,
  className,
  titleWidth = 'four',
  noText,
}) => (
  <div className={classNames('ui row', className)}>
    <div className={classNames(noText ? 'sixteen' : titleWidth, 'wide column title')}>
      <div className="ui tiny header" style={{ overflow: 'hidden' }}>
        {title}
      </div>
    </div>
    {!noText && <div className="column value">{formatText(text)}</div>}
  </div>
);

export interface HeaderProps {
  title: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title }) => (
  <div className="ui row">
    <div className="sixteen wide column">
      <div className="ui blue section header">{title}</div>
    </div>
  </div>
);

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: string;
  stackable?: boolean;
}

export const Grid: React.FC<GridProps> = ({
  className,
  children,
  columns,
  stackable,
  ...other
}) => (
  <div
    className={classNames(
      'ui grid',
      //`${columns} column`,
      { [`${columns} column`]: !!columns },
      { stackable: stackable },
      className,
    )}
    {...other}
  >
    {children}
  </div>
);
