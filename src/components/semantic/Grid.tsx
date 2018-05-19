'use strict';

import React from 'react';
import classNames from 'classnames';


export interface RowProps {
  title: React.ReactNode;
  text: React.ReactNode;
  titleWidth?: string;
}

export const Row: React.SFC<RowProps> = ({ title, text, titleWidth = 'four' }) => (
  <div className="ui row">
    <div className={ classNames(titleWidth, 'wide column') }>
      <div className="ui tiny header">
        { title }
      </div>
    </div>
    <div className="column">
      { text }
    </div>
  </div>
);

export interface HeaderProps {
  title: React.ReactNode;
}

export const Header: React.SFC<HeaderProps> = ({ title }) => (
  <div className="ui blue section header">
    { title }
  </div>
);