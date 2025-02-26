import * as React from 'react';

import * as UI from '@/types/ui';

interface FooterItemProps {
  label?: string;
  text: string | React.ReactElement<any>;
}

export const FooterItem: React.FC<FooterItemProps> = ({ label, text }) => (
  <div className="grid-item">
    <div className="item-inner">
      {!!label && typeof text === 'string' ? `${label}: ${text}` : text}
    </div>
  </div>
);

export const SessionFooter: React.FC<UI.PropsWithChildren> = ({ children }) => (
  <div className="session-footer">
    <div className="ui footer divider" />
    <div className="info-grid ui">{children}</div>
  </div>
);
