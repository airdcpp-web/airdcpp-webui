//import PropTypes from 'prop-types';
import * as React from 'react';
import { useMobileLayout } from 'utils/BrowserUtils';

import ActionButton from 'components/ActionButton';
import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import { MenuIcon } from 'components/menu/MenuIcon';
import { SessionMainLayoutProps } from './SessionLayout';

import * as UI from 'types/ui';
import { translate } from 'utils/TranslationUtils';
import IconConstants from 'constants/IconConstants';

type SessionDropdownProps<SessionT extends UI.SessionItemBase> = Pick<
  SessionMainLayoutProps<SessionT>,
  'sessionMenuItems' | 'newButton' | 'unreadInfoStore' | 'listActionMenuGetter' | 't'
>;

const SessionDropdown = <SessionT extends UI.SessionItemBase>({
  sessionMenuItems,
  newButton,
  unreadInfoStore,
  listActionMenuGetter,
  t,
}: SessionDropdownProps<SessionT>) => (
  <SectionedDropdown
    triggerIcon={
      <MenuIcon
        urgencies={unreadInfoStore ? unreadInfoStore.getTotalUrgencies() : null}
      />
    }
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

type CloseButtonProps<
  SessionT extends UI.SessionItemBase,
  UIActionsT extends UI.ActionListType<UI.SessionItemBase>
> = Pick<
  SessionMainLayoutProps<SessionT, UI.EmptyObject, UIActionsT>,
  'actions' | 'activeItem'
>;

const CloseButton = <
  SessionT extends UI.SessionItemBase,
  UIActionsT extends UI.ActionListType<UI.SessionItemBase>
>({
  actions,
  activeItem,
}: CloseButtonProps<SessionT, UIActionsT>) => {
  if (!activeItem || useMobileLayout()) {
    return null;
  }

  return (
    <ActionButton
      className="basic small item close-button"
      actions={actions}
      actionId="removeSession"
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
  UIActionsT extends UI.ActionListType<UI.SessionItemBase>
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

/*TopMenuLayout.propTypes = {
  itemHeaderTitle: PropTypes.node.isRequired,
  itemHeaderIcon: PropTypes.node.isRequired,
  activeItem: PropTypes.object,
  newButton: PropTypes.node,
  sessionMenuItems: PropTypes.array.isRequired,
  closeAction: PropTypes.func.isRequired,
  listActionMenuGetter: PropTypes.func.isRequired,
};*/

export default TopMenuLayout;
