'use strict';
import React from 'react';

import { Link } from 'react-router-dom';

import Logo from 'images/AirDCPlusPlus.png';
//import Logo from 'images/logo.svg';
//import Logo from 'file-loader!images/logo.svg';
//import Logo from 'svg-inline-loader?classPrefix!images/logo.svg';
//import Logo from 'svg-url-loader!images/logo.svg';
//import Logo from 'svg-react-loader?name=Logo!images/logo.svg';


const SiteHeader: React.FC = ({ children }) => (
  <div className="ui fixed inverted menu site-header">
    <div className="ui header-content">
      <Link to="/" className="item">
        <img className="logo" src={ Logo }/>
        {/*<Logo style={{ height: '2.5em', width: '2.5em' }}/>*/}
        {/*<img className="logo" src={ Logo }/>*/}
      </Link>
      { children }
    </div>
  </div>
);

export default SiteHeader;
