import PropTypes from 'prop-types';
import React from 'react';
import { useMobileLayout } from 'utils/BrowserUtils';

import ActionButton from 'components/ActionButton';
import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import MenuIcon from 'components/menu/MenuIcon';


const SessionDropdown = ({ sessionMenuItems, newButton, unreadInfoStore, closeAction, listActionMenuGetter }) => (
  <SectionedDropdown triggerIcon={ <MenuIcon urgencies={ unreadInfoStore ? unreadInfoStore.getTotalUrgencies() : null } />}>
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

const CloseButton = ({ closeAction, activeItem }) => {
  if (!activeItem || useMobileLayout()) {
    return null;
  }

  return (
    <ActionButton 
      className="basic small item close-button"
      action={ closeAction } 
      itemData={ activeItem }
      icon="grey remove"
    />
  );
};

const SessionItemHeader = ({ itemHeaderIcon, itemHeaderTitle, activeItem, actionMenu }) => (
  <div className="session-header">
    { itemHeaderIcon }
    { itemHeaderTitle }
  </div>
);

const TopMenuLayout = ({ children, ...props }) => (
  <div className="session-container vertical">
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

TopMenuLayout.propTypes = {
  itemHeaderTitle: PropTypes.node.isRequired,
  itemHeaderIcon: PropTypes.node.isRequired,
  activeItem: PropTypes.object,
  newButton: PropTypes.node,
  sessionMenuItems: PropTypes.array.isRequired,
  closeAction: PropTypes.func.isRequired,
  listActionMenuGetter: PropTypes.func.isRequired,
};

export default TopMenuLayout;
