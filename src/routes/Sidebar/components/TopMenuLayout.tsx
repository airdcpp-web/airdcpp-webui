//import PropTypes from 'prop-types';
import React from 'react';
import { useMobileLayout } from 'utils/BrowserUtils';

import ActionButton from 'components/ActionButton';
import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import { MenuIcon } from 'components/menu/MenuIcon';
import { SessionMainLayoutProps, SessionBaseType } from './SessionLayout';

import * as UI from 'types/ui';


type SessionDropdownProps<SessionT extends SessionBaseType> = 
  Pick<SessionMainLayoutProps<SessionT>, 'sessionMenuItems' | 'newButton' | 'unreadInfoStore' | 'listActionMenuGetter'>;

const SessionDropdown: React.FC<SessionDropdownProps</*SessionT*/ any>> = ({ 
  sessionMenuItems, newButton, unreadInfoStore, listActionMenuGetter 
}) => (
  <SectionedDropdown 
    triggerIcon={ <MenuIcon urgencies={ unreadInfoStore ? unreadInfoStore.getTotalUrgencies() : null } />}
  >
    <MenuSection caption="New">
      { newButton }
    </MenuSection>
    <MenuSection caption="Current sessions">
      { sessionMenuItems }
    </MenuSection>
    <MenuSection>
      { listActionMenuGetter() }
    </MenuSection>
  </SectionedDropdown>
);


type CloseButtonProps<SessionT extends SessionBaseType> = 
  Pick<SessionMainLayoutProps<SessionT>, 'closeAction' | 'activeItem' | 'moduleId'>;

const CloseButton: React.FC<CloseButtonProps<any>> = (
  { closeAction, activeItem, moduleId }
) => {
  if (!activeItem || useMobileLayout()) {
    return null;
  }

  return (
    <ActionButton 
      className="basic small item close-button"
      action={ closeAction } 
      itemData={ activeItem }
      icon="grey remove"
      moduleId={ moduleId }
    />
  );
};

type SessionItemHeaderProps = Pick<SessionMainLayoutProps<any>, 'itemHeaderIcon' | 'itemHeaderTitle'>;

const SessionItemHeader: React.FC<SessionItemHeaderProps> = ({ itemHeaderIcon, itemHeaderTitle }) => (
  <div className="session-header">
    { itemHeaderIcon }
    { itemHeaderTitle }
  </div>
);

const TopMenuLayout = <SessionT extends UI.SessionItemBase>(
  { children, onKeyDown, ...props }: SessionMainLayoutProps<SessionT>
) => (
  <div className="session-container vertical" onKeyDown={ onKeyDown }>
    <div className="ui main menu menu-bar">
      <div className="content-left">
        <SessionDropdown { ...props }/>
        <SessionItemHeader { ...props }/>
      </div>
      <CloseButton { ...props }/>
    </div>

    <div className="session-layout">
      { children }
    </div>
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
