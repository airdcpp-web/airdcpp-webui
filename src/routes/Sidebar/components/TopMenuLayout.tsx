import * as React from 'react';
import { usingMobileLayout } from '@/utils/BrowserUtils';

import ActionButton from '@/components/ActionButton';
import SectionedDropdown from '@/components/semantic/SectionedDropdown';
import MenuSection from '@/components/semantic/MenuSection';
import { MenuIcon } from '@/components/icon/MenuIcon';

import * as UI from '@/types/ui';
import { translate } from '@/utils/TranslationUtils';
import IconConstants from '@/constants/IconConstants';
import { useTranslation } from 'react-i18next';
import { SessionMainLayoutProps } from './types';
import { useSessionStoreProperty } from '@/context/SessionStoreContext';

type SessionDropdownProps<SessionT extends UI.SessionItemBase> = Pick<
  SessionMainLayoutProps<SessionT>,
  'sessionMenuItemsGetter' | 'newButton' | 'sessionStoreSelector' | 'listActionMenuGetter'
>;

const SessionDropdown = <SessionT extends UI.SessionItemBase>({
  sessionMenuItemsGetter,
  newButton,
  sessionStoreSelector,
  listActionMenuGetter,
}: SessionDropdownProps<SessionT>) => {
  const { t } = useTranslation();
  const getTotalUrgencies = useSessionStoreProperty(
    (state) => sessionStoreSelector(state).getTotalUrgencies,
  );

  const sessionMenuItems = sessionMenuItemsGetter({
    role: 'menuitem',
  });
  return (
    <SectionedDropdown
      triggerIcon={<MenuIcon label="Session menu" urgencies={getTotalUrgencies()} />}
    >
      <MenuSection caption={translate('New', t, UI.Modules.COMMON)}>
        {newButton}
      </MenuSection>
      <MenuSection caption={translate('Current sessions', t, UI.Modules.COMMON)}>
        {sessionMenuItems}
      </MenuSection>
      <MenuSection>{listActionMenuGetter()}</MenuSection>
    </SectionedDropdown>
  );
};

type CloseButtonProps<
  SessionT extends UI.SessionItemBase,
  UIActionsT extends UI.ActionListType<UI.SessionItemBase>,
> = Pick<
  SessionMainLayoutProps<SessionT, UI.EmptyObject, UIActionsT>,
  'actions' | 'activeItem'
>;

const CloseButton = <
  SessionT extends UI.SessionItemBase,
  UIActionsT extends UI.ActionListType<UI.SessionItemBase>,
>({
  actions,
  activeItem,
}: CloseButtonProps<SessionT, UIActionsT>) => {
  if (!activeItem || usingMobileLayout()) {
    return null;
  }

  /*const closeAction = Object.values(actions.actions).find(
    (action) => !!action && action.id === 'remove',
  ) as UI.ActionDefinition<UI.SessionItemBase>;*/

  const closeAction = Object.values(actions.actions)[
    Object.values(actions.actions).length - 1
  ];
  return (
    <ActionButton
      className="basic small item close-button"
      action={closeAction as UI.ActionDefinition<UI.SessionItemBase>}
      moduleData={actions.moduleData}
      itemData={activeItem}
      icon={IconConstants.CLOSE}
    />
  );
};

type SessionItemHeaderProps = Pick<
  SessionMainLayoutProps<any>,
  'itemHeaderIcon' | 'itemHeaderTitle'
>;

const SessionItemHeader: React.FC<SessionItemHeaderProps> = ({
  itemHeaderIcon,
  itemHeaderTitle,
}) => (
  <div className="session-header">
    {itemHeaderIcon}
    {itemHeaderTitle}
  </div>
);

const TopMenuLayout = <
  SessionT extends UI.SessionItemBase,
  SessionApiT extends object,
  UIActionsT extends UI.ActionListType<UI.SessionItemBase>,
>({
  children,
  onKeyDown,
  ...props
}: SessionMainLayoutProps<SessionT, SessionApiT, UIActionsT>) => (
  <div className="session-container vertical" onKeyDown={onKeyDown} tabIndex={0}>
    <div className="ui main menu menu-bar">
      <div className="content-left">
        <SessionDropdown {...props} />
        <SessionItemHeader {...props} />
      </div>
      <CloseButton {...props} />
    </div>

    <div className="session-layout">{children}</div>
  </div>
);

export default TopMenuLayout;
