import React from 'react';

import RedrawDecorator from 'decorators/RedrawDecorator';
import { formatRelativeTime } from 'utils/ValueFormat';

import '../style.css';


export interface FooterProps {
  lastUpdated?: number;
  handleUpdate: () => void;
}

const Footer = RedrawDecorator(
  ({ lastUpdated, handleUpdate }: FooterProps) => (
    <div className="extra content">
      <i className="icon refresh link" onClick={ handleUpdate }/>
      { !!lastUpdated && `Last updated: ${formatRelativeTime(lastUpdated / 1000)}` }
    </div>
  ), 
  60
);

export default Footer;