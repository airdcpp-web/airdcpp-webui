'use strict';

import React from 'react';
//import classNames from 'classnames';
import { Grid, GridProps } from 'components/semantic/Grid';


export interface AboutGridProps extends GridProps {

}

export const AboutGrid: React.FC<AboutGridProps> = ({ children, ...other }) => (
  <div 
    style={{
      // Negative margins for .ui.grid cause issues with flexbox
      margin: '0px 5px',
      overflow: 'hidden'
    }}
  >
    <Grid 
      columns="two"
      { ...other }
    >
      { children }
    </Grid>
  </div>
);
