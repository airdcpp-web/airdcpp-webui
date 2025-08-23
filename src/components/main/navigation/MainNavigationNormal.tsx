import SectionedDropdown from '@/components/semantic/SectionedDropdown';
import MenuSection from '@/components/semantic/MenuSection';

import { parseMenuItems, parseMenuItem, getLogoutItem } from '@/routes/Routes';
import { useSocket } from '@/context/SocketContext';
import { MainLayoutProps } from '../AuthenticatedApp';
import { useAppStore } from '@/context/AppStoreContext';
import { useSession } from '@/context/AppStoreContext';

type MainNavigationNormalProps = Pick<
  MainLayoutProps,
  'primaryRoutes' | 'secondaryRoutes'
>;

const MainNavigationNormal: React.FC<MainNavigationNormalProps> = ({
  primaryRoutes,
  secondaryRoutes,
}) => {
  const socket = useSocket();
  const appStore = useAppStore();
  const session = useSession();
  return (
    <div className="item right" role="navigation" aria-label="Main navigation">
      {parseMenuItems(primaryRoutes, session, { showIcon: false })}

      <SectionedDropdown className="top right">
        <MenuSection>{parseMenuItems(secondaryRoutes, session)}</MenuSection>
        <MenuSection>{parseMenuItem(getLogoutItem(socket, appStore))}</MenuSection>
      </SectionedDropdown>
    </div>
  );
};

export default MainNavigationNormal;
