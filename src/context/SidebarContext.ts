import React from 'react';

export const SidebarContext = React.createContext<boolean>(false);

export const useSidebarContext = () => {
  return React.useContext(SidebarContext);
};
