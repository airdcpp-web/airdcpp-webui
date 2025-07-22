import SectionedDropdown from '@/components/semantic/SectionedDropdown';
import MenuSection from '@/components/semantic/MenuSection';

import { parseMenuItems, parseMenuItem, getLogoutItem } from '@/routes/Routes';
import { useSession } from '@/context/SessionContext';
import { useSocket } from '@/context/SocketContext';
import { MainLayoutProps } from '../AuthenticatedApp';

type MainNavigationNormalProps = Pick<
  MainLayoutProps,
  'primaryRoutes' | 'secondaryRoutes'
>;

const MainNavigationNormal: React.FC<MainNavigationNormalProps> = ({
  primaryRoutes,
  secondaryRoutes,
}) => {
  const login = useSession();
  const socket = useSocket();
  return (
    <div className="item right">
      {parseMenuItems(primaryRoutes, login, undefined, false)}

      <SectionedDropdown className="top right">
        <MenuSection>{parseMenuItems(secondaryRoutes, login)}</MenuSection>
        <MenuSection>{parseMenuItem(getLogoutItem(socket))}</MenuSection>
      </SectionedDropdown>
    </div>
  );
};

export default MainNavigationNormal;
