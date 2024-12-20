import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';

import {
  configRoutes,
  mainRoutes,
  logoutItem,
  parseMenuItems,
  parseMenuItem,
} from 'routes/Routes';
import { useSession } from 'context/SessionContext';

const MainNavigationNormal = () => {
  const login = useSession();
  return (
    <div className="item right">
      {parseMenuItems(mainRoutes, login, undefined, false)}

      <SectionedDropdown className="top right">
        <MenuSection>{parseMenuItems(configRoutes, login)}</MenuSection>
        <MenuSection>{parseMenuItem(logoutItem)}</MenuSection>
      </SectionedDropdown>
    </div>
  );
};

export default MainNavigationNormal;
