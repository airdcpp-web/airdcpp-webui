import React from 'react';

import Icon from './Icon';

const DropdownCaption = ({ icon, children }) => {
  return (
    <div className="caption">
      <Icon icon={ icon }/>
      { children }
    </div>
  );
};

export default DropdownCaption
;