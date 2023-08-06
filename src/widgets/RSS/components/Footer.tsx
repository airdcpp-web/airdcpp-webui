import { Trans } from 'react-i18next';

import Icon from 'components/semantic/Icon';

import IconConstants from 'constants/IconConstants';
import RedrawDecorator from 'decorators/RedrawDecorator';
import { formatRelativeTime } from 'utils/ValueFormat';

import * as UI from 'types/ui';

export interface FooterProps {
  lastUpdated?: number;
  handleUpdate: () => void;
  widgetT: UI.ModuleTranslator;
}

const Footer = RedrawDecorator(
  ({ lastUpdated, handleUpdate, widgetT }: FooterProps) => (
    <div className="extra content">
      <Icon icon={IconConstants.REFRESH_PLAIN} onClick={handleUpdate} />
      {!!lastUpdated && (
        <Trans i18nKey={widgetT.toI18nKey('lastUpdated')}>
          <>Last updated: {{ time: formatRelativeTime(lastUpdated / 1000) }}</>
        </Trans>
      )}
    </div>
  ),
  60,
);

export default Footer;
