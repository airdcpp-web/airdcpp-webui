import * as React from 'react';
import classNames from 'classnames';

import * as UI from 'types/ui';

import Loader from 'components/semantic/Loader';
import { Trans } from 'react-i18next';
import { toI18nKey } from 'utils/TranslationUtils';

import DropdownCaption from './DropdownCaption';

export interface EmptyDropdownCaptionProps {
  caption: React.ReactNode;
  className?: string;
}

// A component used to emulate a dropdown when there are no items to display
export const EmptyDropdownCaption: React.FC<EmptyDropdownCaptionProps> = ({
  caption,
  className,
}) => {
  const titleClassName = classNames(
    //'caption',
    'ui empty dropdown',
    className
  );

  return (
    <div className={titleClassName}>
      <DropdownCaption>{caption}</DropdownCaption>
    </div>
  );
};

export interface EmptyDropdownContentProps {
  loading: boolean;
}

export const EmptyDropdownContent = ({ loading }: EmptyDropdownContentProps) => (
  <div className="item">
    {loading ? (
      <Loader inline={true} text="" />
    ) : (
      <Trans i18nKey={toI18nKey('noActionsAvailable', UI.Modules.COMMON)}>
        No actions available
      </Trans>
    )}
  </div>
);
