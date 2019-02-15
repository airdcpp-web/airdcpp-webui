import React from 'react';
import { Trans } from 'react-i18next';

import RedrawDecorator from 'decorators/RedrawDecorator';
import { formatRelativeTime } from 'utils/ValueFormat';

import * as UI from 'types/ui';
import '../style.css';


export interface FooterProps {
  lastUpdated?: number;
  handleUpdate: () => void;
  widgetT: UI.ModuleTranslator;
}

const Footer = RedrawDecorator(
  ({ lastUpdated, handleUpdate, widgetT }: FooterProps) => (
    <div className="extra content">
      <i className="icon refresh link" onClick={ handleUpdate }/>
      { !!lastUpdated && (
        <Trans i18nKey={ widgetT.toI18nKey('lastUpdated') }>
          Last updated: {{ time: formatRelativeTime(lastUpdated / 1000) }}
        </Trans>
      ) }
    </div>
  ), 
  60
);

export default Footer;