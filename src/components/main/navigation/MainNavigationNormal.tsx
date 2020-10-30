'use strict';;
import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';

import { configRoutes, mainRoutes, logoutItem, parseMenuItems, parseMenuItem } from 'routes/Routes';


const MainNavigationNormal = () => (
  <div className="item right">
    { parseMenuItems(mainRoutes, undefined, false) }

    <SectionedDropdown className="top right">
      <MenuSection>
        { parseMenuItems(configRoutes) }
      </MenuSection>
      <MenuSection>
        { parseMenuItem(logoutItem) }
      </MenuSection>
    </SectionedDropdown>
  </div>
);

export default MainNavigationNormal;
