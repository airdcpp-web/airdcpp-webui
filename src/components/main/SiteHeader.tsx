import * as React from 'react';

import { Link } from 'react-router-dom';

import Logo from 'images/AirDCPlusPlus.png';


const SiteHeader: React.FC = ({ children }) => (
  <div className="ui fixed inverted menu site-header">
    <div className="ui header-content">
      <Link to="/" className="item">
        <img className="logo" src={ Logo }/>
      </Link>
      { children }
    </div>
  </div>
);

export default SiteHeader;
