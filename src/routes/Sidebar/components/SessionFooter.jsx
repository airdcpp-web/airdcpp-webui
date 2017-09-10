'use strict';
import React from 'react';


export const FooterItem = ({ label, text }) => (
  <div className="grid-item">
    <div className="item-inner">
      { label && text.length > 0 ? (label + ': ' + text) : text }
    </div>
  </div>
);

export const SessionFooter = ({ children }) => (
  <div className="session-footer">
    <div className="ui footer divider"/>
    <div className="info-grid ui">
      { children }
    </div>
  </div>
);