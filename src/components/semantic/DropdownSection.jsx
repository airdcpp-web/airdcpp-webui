import React, { Fragment } from 'react';
import Icon from './Icon';

const DropdownSection = ({ caption, icon, children }) => {
  if (!children) {
    return null;
  }
  
  return (
    <Fragment>
      { caption && (
        <div className="header">
          { !!icon ? caption : (
            <Fragment>    
              <Icon icon={ icon }/>
              { caption }
            </Fragment>
          ) }
        </div>
      ) }
      { children }
    </Fragment> 
  );
};

export default DropdownSection;