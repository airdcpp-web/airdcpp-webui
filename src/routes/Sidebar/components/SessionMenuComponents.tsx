import { ActionMenu } from '@/components/action-menu';
import SessionNewButton from './SessionNewButton';
import SessionMenuItem from './SessionMenuItem';

import Icon from '@/components/semantic/Icon';

import IconConstants from '@/constants/IconConstants';
import MenuItemLink from '@/components/semantic/MenuItemLink';

import * as UI from '@/types/ui';

import { translate } from '@/utils/TranslationUtils';
import { SessionLayoutLabels, SessionLayoutManageProps } from './types';
import { useLocation } from 'react-router';
import { useSessionRouteHelpers } from './effects/useSessionHelpers';
import { useTranslation } from 'react-i18next';

export const useComponents = <
  SessionT extends UI.SessionItemBase,
  SessionApiT extends object = UI.EmptyObject,
  UIActionT extends UI.ActionListType<UI.SessionItemBase> = UI.EmptyObject,
>(
  props: UI.SessionInfoGetter<SessionT> & {
    activeItem: SessionT | null;
    hasEditAccess: boolean;
    isNewLayout: boolean;
  } & SessionLayoutLabels &
    SessionLayoutManageProps<SessionT, SessionApiT, UIActionT>,
) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { newUrl, getSessionUrl } = useSessionRouteHelpers({
    baseUrl: props.baseUrl,
  });

  // COMPONENT GETTERS
  const getItemStatus = (sessionItem: SessionT) => {
    const { itemStatusGetter, itemHeaderIconGetter } = props;
    if (itemStatusGetter) {
      return (
        <div
          className={
            'ui session-status empty circular left mini label ' +
            itemStatusGetter(sessionItem)
          }
        />
      );
    }

    return <Icon icon={itemHeaderIconGetter(sessionItem)} />;
  };

  const components = {
    // Current session
    getItemHeaderDescription: () => {
      const { itemHeaderDescriptionGetter, newDescription, activeItem, isNewLayout } =
        props;
      if (isNewLayout) {
        return newDescription;
      }

      if (activeItem) {
        return itemHeaderDescriptionGetter(activeItem);
      }

      return null;
    },
    getItemHeaderIcon: () => {
      const { itemHeaderIconGetter, newIcon, activeItem, isNewLayout } = props;
      if (isNewLayout) {
        return <Icon icon={newIcon} />;
      }

      if (activeItem) {
        return <Icon icon={itemHeaderIconGetter(activeItem)} />;
      }

      return null;
    },
    getItemHeaderTitle: () => {
      const { activeItem, newCaption, remoteMenuId, isNewLayout } = props;
      if (isNewLayout) {
        return <div>{newCaption}</div>;
      }

      if (!activeItem) {
        return null;
      }

      const { uiActions, actionIds, itemNameGetter, itemHeaderTitleGetter } = props;

      const ids = actionIds ? [...actionIds, 'divider', 'remove'] : undefined;
      const actionMenu = (
        <ActionMenu
          caption={itemNameGetter(activeItem)}
          actions={uiActions}
          itemData={activeItem}
          ids={ids}
          remoteMenuId={remoteMenuId}
        />
      );

      // Use the header getter only if there is a getter that returns a valid value
      if (itemHeaderTitleGetter) {
        const header = itemHeaderTitleGetter(activeItem, location, actionMenu);
        if (header) {
          return header;
        }
      }

      return actionMenu;
    },

    // Other
    getSessionActionMenuItems: () => {
      const { items, hasEditAccess } = props;
      if (!hasEditAccess || items.length === 0) {
        return null;
      }

      const handleCloseAll = () => {
        const { sessionApi, items } = props;
        items.forEach((session) => sessionApi.removeSession(session));
      };

      return (
        <MenuItemLink key="close" onClick={handleCloseAll} icon={IconConstants.REMOVE}>
          {translate('Close all', t, UI.Modules.COMMON)}
        </MenuItemLink>
      );
    },
    getNewButton: () => {
      const { newCaption, hasEditAccess } = props;
      if (!hasEditAccess || !newCaption) {
        return null;
      }

      return <SessionNewButton key="new-button" title={newCaption} url={newUrl} />;
    },
    getSessionMenuItems: () => {
      const getSessionMenuItem = (sessionItem: SessionT) => {
        const { itemNameGetter, sessionStoreSelector } = props;
        return (
          <SessionMenuItem
            key={sessionItem.id}
            url={getSessionUrl(sessionItem.id)}
            name={itemNameGetter(sessionItem)}
            unreadInfoStoreSelector={sessionStoreSelector}
            status={getItemStatus(sessionItem)}
            sessionItem={sessionItem}
          />
        );
      };

      return props.items.map(getSessionMenuItem);
    },
  };

  return components;
};
