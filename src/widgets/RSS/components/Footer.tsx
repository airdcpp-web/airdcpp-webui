import React from 'react';
import { Trans } from 'react-i18next';

import RedrawDecorator from 'decorators/RedrawDecorator';
import { formatRelativeTime } from 'utils/ValueFormat';

import * as UI from 'types/ui';
import '../style.css';


export interface FooterProps extends Pick<UI.WidgetProps, 'toWidgetI18nKey'> {
  lastUpdated?: number;
  handleUpdate: () => void;
}

const Footer = RedrawDecorator(
  ({ lastUpdated, handleUpdate, toWidgetI18nKey }: FooterProps) => (
    <div className="extra content">
      <i className="icon refresh link" onClick={ handleUpdate }/>
      { !!lastUpdated && (
        <Trans i18nKey={ toWidgetI18nKey('lastUpdated') }>
          Last updated: {{ time: formatRelativeTime(lastUpdated / 1000) }}
        </Trans>
      ) }
    </div>
  ), 
  60
);

export default Footer;