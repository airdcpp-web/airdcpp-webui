//import PropTypes from 'prop-types';
import React from 'react';

import classNames from 'classnames';

import 'semantic-ui-css/components/loader.min.css';
import { Trans } from 'react-i18next';

import * as UI from 'types/ui';
import { toI18nKey } from 'utils/TranslationUtils';


interface LoaderProps {
  inline?: boolean;
  className?: string;
  text?: React.ReactNode;
  size?: string;
  inverted?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ text, className, inline, size, inverted }) => {
  const style = classNames(
    'ui active  loader',
    { 'inverted': inverted },
    { 'inline': inline },
    { 'text': !inline }, // Should be used even if there is no text because of styling
    className,
    size,
  );

  if (inline && !!text) {
    return (
      <div className="inline-loader">
        <div className={ style }/>
        { text }
      </div>
    );
  }

  return (
    <div className={ style }>
      { text !== undefined ? text : <Trans i18nKey={ toI18nKey('loading', UI.Modules.COMMON) }>Loading</Trans> }
    </div>
  );
};

/*Loader.propTypes = {
  text: PropTypes.node,
  inline: PropTypes.bool,
};*/

//Loader.defaultProps = {
//  text: 'Loading',
//};

export default Loader;
