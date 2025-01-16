import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';

import {
  configRoutes,
  mainRoutes,
  parseMenuItems,
  parseMenuItem,
  getLogoutItem,
} from 'routes/Routes';
import { useSession } from 'context/SessionContext';
import { useSocket } from 'context/SocketContext';

const MainNavigationNormal = () => {
  const login = useSession();
  const socket = useSocket();
  return (
    <div className="item right">
      {parseMenuItems(mainRoutes, login, undefined, false)}

      <SectionedDropdown className="top right">
        <MenuSection>{parseMenuItems(configRoutes, login)}</MenuSection>
        <MenuSection>{parseMenuItem(getLogoutItem(socket))}</MenuSection>
      </SectionedDropdown>
    </div>
  );
};

export default MainNavigationNormal;
