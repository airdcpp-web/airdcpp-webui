'use strict';
import React from 'react';

import { Link } from 'react-router-dom';
import Logo from 'images/AirDCPlusPlus.png';


const SiteHeader = ({ content }) => (
  <div className="ui fixed inverted menu site-header">
    <div className="ui header-content">
      <Link to="/" className="item">
        <img className="logo" src={ Logo }/>
      </Link>
      { content }
    </div>
  </div>
);

export default SiteHeader;
