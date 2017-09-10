'use strict';

import React from 'react';


export const Row = ({ title, text, titleWidth = 'four' }) => (
  <div className="ui row">
    <div className={ titleWidth + ' wide column' }>
      <div className="ui tiny header">
        { title }
      </div>
    </div>
    <div className="column">
      { text }
    </div>
  </div>
);

export const Header = ({ title }) => (
  <div className="ui blue section header">
    { title }
  </div>
);