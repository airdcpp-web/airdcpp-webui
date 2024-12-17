import * as React from 'react';

import classNames from 'classnames';

import 'fomantic-ui-css/components/loader.min.css';
import { Trans } from 'react-i18next';

import * as UI from 'types/ui';
import { toI18nKey } from 'utils/TranslationUtils';

interface LoaderProps {
  inline?: boolean;
  className?: string;
  text?: React.ReactNode;
  size?: string;
  inverted?: boolean;
  fullPage?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  text,
  className,
  inline,
  size,
  inverted,
  fullPage,
}) => {
  const style = classNames(
    'ui active loader',
    { inverted: inverted },
    { inline: inline },
    { text: !inline }, // Should be used even if there is no text because of styling
    className,
    size,
  );

  const content =
    text !== undefined ? (
      text
    ) : (
      <Trans i18nKey={toI18nKey('loading', UI.Modules.COMMON)}>Loading</Trans>
    );

  if (inline) {
    return (
      <div className="inline-loader">
        <div className={style} />
        {content}
      </div>
    );
  }

  if (fullPage) {
    return (
      <div className="ui dimmer page visible active">
        <div className="content">
          <div className="center">
            <div className={style}>{content}</div>
          </div>
        </div>
      </div>
    );
  }

  return <div className={style}>{content}</div>;
};

export default Loader;
