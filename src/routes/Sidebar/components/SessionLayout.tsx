import * as React from 'react';

import Loader from '@/components/semantic/Loader';

import TopMenuLayout from './TopMenuLayout';
import SideMenuLayout from './SideMenuLayout';

import Message from '@/components/semantic/Message';

import { usingMobileLayout } from '@/utils/BrowserUtils';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { translate, toI18nKey } from '@/utils/TranslationUtils';
import { useLayoutWidth } from '@/context/LayoutWidthContext';
import { useSessionManager } from './effects/useSessionManager';
import { useLocation, useNavigate } from 'react-router';

import {
  NewSessionLayoutProps,
  SessionChildProps,
  SessionLayoutLabels,
  SessionLayoutManageProps,
  SessionLocationState,
} from './types';
import { useComponents } from './SessionMenuComponents';
import { useSession } from '@/context/AppStoreContext';

import '../sessions.css';
import { hasAccess } from '@/utils/AuthUtils';

export interface SessionLayoutProps<
  SessionT extends UI.SessionItemBase,
  SessionApiT extends object = UI.EmptyObject,
  UIActionT extends UI.ActionListType<UI.SessionItemBase> = UI.EmptyObject,
> extends UI.SessionInfoGetter<SessionT>,
    SessionLayoutLabels,
    SessionLayoutManageProps<SessionT, SessionApiT, UIActionT> {
  // Item ID that is currently active (if any)
  activeId: API.IdType | undefined;

  // Set to false if the side menu should never be shown (the session will use all width that is available)
  disableSideMenu?: boolean;

  sessionItemLayout: React.ComponentType<
    SessionChildProps<SessionT, SessionApiT, UIActionT>
  >;

  newLayout?: React.ComponentType<NewSessionLayoutProps>;

  sessionT: UI.ModuleTranslator;
}

const SessionLayout = <
  SessionT extends UI.SessionItemBase,
  SessionApiT extends object,
  UIActionsT extends UI.ActionListType<UI.SessionItemBase>,
>(
  props: SessionLayoutProps<SessionT, SessionApiT, UIActionsT>,
) => {
  const session = useSession();
  const layoutWidth = useLayoutWidth();
  const navigate = useNavigate();
  const location = useLocation();

  const { activeItem, onKeyDown } = useSessionManager(props);

  const hasEditAccess = hasAccess(session, props.editAccess);
  const isNewLayout = !!props.newLayout && location.pathname.endsWith('/new');

  const getSessionChildren = () => {
    const {
      activeId,
      items,
      sessionItemLayout: SessionItemLayout,
      sessionApi,
      uiActions,
      sessionT,
      baseUrl,
    } = props;

    if (!activeItem) {
      const { state } = location;
      if (!!state && (state as SessionLocationState).pending) {
        // The session was just created
        return (
          <Loader
            text={translate(
              'Waiting for server response',
              sessionT.plainT,
              UI.Modules.COMMON,
            )}
          />
        );
      } else if (activeId || items.length !== 0) {
        // Redirecting to a new page
        return (
          <Loader
            text={translate('Loading session', sessionT.plainT, UI.Modules.COMMON)}
          />
        );
      }

      console.error('SessionLayout route: active session missing');
      return;
    }

    // We have a session
    return (
      <SessionItemLayout
        sessionItem={activeItem}
        sessionApi={sessionApi}
        uiActions={uiActions}
        location={location}
        navigate={navigate}
        sessionT={sessionT}
        baseUrl={baseUrl}
      />
    );
  };

  const getChildren = () => {
    const { newLayout: NewLayout, sessionT } = props;
    if (isNewLayout && NewLayout) {
      return <NewLayout navigate={navigate} location={location} sessionT={sessionT} />;
    }

    return getSessionChildren();
  };

  const { disableSideMenu, items, sessionStoreSelector, sessionT, uiActions } = props;

  const useTopMenu = disableSideMenu || usingMobileLayout(layoutWidth);

  const {
    getItemHeaderTitle,
    getItemHeaderDescription,
    getItemHeaderIcon,
    getNewButton,
    getSessionMenuItems,
    getSessionActionMenuItems,
  } = useComponents({ ...props, activeItem, hasEditAccess, isNewLayout });

  if (!hasEditAccess && items.length === 0) {
    // Nothing to show
    return (
      <Message
        title={translate('No items to show', sessionT.plainT, UI.Modules.COMMON)}
        description={sessionT.plainT(
          toI18nKey('noSessionEditAccess', UI.Modules.COMMON),
          `You aren't allowed to open new sessions`,
        )}
      />
    );
  }

  const MenuLayout = useTopMenu ? TopMenuLayout : SideMenuLayout;
  return (
    <MenuLayout
      itemHeaderTitle={getItemHeaderTitle()}
      itemHeaderDescription={getItemHeaderDescription()}
      itemHeaderIcon={getItemHeaderIcon()}
      newButton={getNewButton()}
      sessionMenuItemsGetter={getSessionMenuItems}
      listActionMenuGetter={getSessionActionMenuItems}
      activeItem={activeItem}
      sessionStoreSelector={sessionStoreSelector}
      onKeyDown={onKeyDown}
      actions={uiActions}
    >
      {getChildren()}
    </MenuLayout>
  );
};

export default SessionLayout;
