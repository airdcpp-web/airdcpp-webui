import * as React from 'react';


interface FooterItemProps {
  label?: string;
  text: string | React.ReactElement<any>;
}

export const FooterItem: React.FC<FooterItemProps> = ({ label, text }) => (
  <div className="grid-item">
    <div className="item-inner">
      { !!label && typeof text === 'string' ? `${label}: ${text}` : text }
    </div>
  </div>
);

export const SessionFooter: React.FC = ({ children }) => (
  <div className="session-footer">
    <div className="ui footer divider"/>
    <div className="info-grid ui">
      { children }
    </div>
  </div>
);