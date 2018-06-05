import React from 'react';

import './style.css';

import 'semantic-ui/components/breadcrumb.min.css';


export type SelectedNameFormatter = (caption: React.ReactNode, token: string) => React.ReactNode;

interface SectionProps {
  caption: React.ReactNode;
  onClick: () => void;
}

export const Section: React.SFC<SectionProps> = ({ caption, onClick }) => (
  <div className="path-token">
    <a className="section" onClick={ onClick }>
      { caption }
    </a>
    <i className="right chevron icon divider"/>
  </div>
);

interface SelectedSectionProps {
  caption: React.ReactNode;
  selectedNameFormatter?: SelectedNameFormatter;
  token: string;
}

export const SelectedSection: React.SFC<SelectedSectionProps> = ({ selectedNameFormatter, caption, token }) => (
  <div className="ui label current path-token section">
    { !!selectedNameFormatter ? selectedNameFormatter(caption, token) : caption }
  </div>
);
