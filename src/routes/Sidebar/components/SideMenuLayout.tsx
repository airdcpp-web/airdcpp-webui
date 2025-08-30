import * as React from 'react';

import LayoutHeader from '@/components/semantic/LayoutHeader';
import { Grid } from '@/components/semantic/Grid';

import * as UI from '@/types/ui';
import { SessionMainLayoutProps } from './types';
import { noMouseFocusProps } from '@/utils/BrowserUtils';

// Define a static ID for the content panel so the tabs can control it.
const CONTENT_PANEL_ID = 'session-content-panel';

const SideMenuLayout = <
  SessionT extends UI.SessionItemBase,
  SessionApiT extends object,
  UIActionsT extends UI.ActionListType<UI.SessionItemBase>,
>({
  sessionMenuItemsGetter,
  newButtonGetter,
  itemHeaderIcon,
  itemHeaderTitle,
  children,
  itemHeaderDescription,
  onKeyDown,
}: SessionMainLayoutProps<SessionT, SessionApiT, UIActionsT>) => {
  const newButton = newButtonGetter({
    role: 'tab',
    'aria-controls': CONTENT_PANEL_ID,
    className: 'ui fluid button',
  });

  // Find the active menu item to link the panel to its controlling tab
  // const activeItem = sessionMenuItems.find((item) => item.props.active);

  const sessionMenuItems = sessionMenuItemsGetter({
    role: 'tab',
    'aria-controls': CONTENT_PANEL_ID,
    ...noMouseFocusProps,
  });

  return (
    // The onKeyDown handler for roving focus is correct, but the container itself should not be a tab stop.
    <Grid className="session-container horizontal" onKeyDown={onKeyDown}>
      {/* This <nav> element provides a navigation landmark for screen readers */}
      <nav className="four wide column menu-column" aria-label="Session items">
        {newButton}
        {!!sessionMenuItems.length && (
          <div
            className="ui vertical secondary menu"
            role="tablist"
            aria-orientation="vertical"
          >
            {/* The sessionMenuItems passed in must have role="tab" */}
            {sessionMenuItems}
          </div>
        )}
      </nav>
      {/* This is the content panel controlled by the tabs. */}
      <div
        id={CONTENT_PANEL_ID}
        role="tabpanel"
        // It is labelled by the currently active tab.
        // This assumes the menu item component has a unique `id` prop.
        // aria-labelledby={activeItem ? activeItem.props.id : undefined}
        className="twelve wide stretched column content-column session"
      >
        <div className="ui segment session-layout">
          <LayoutHeader
            className="session-header"
            icon={itemHeaderIcon}
            title={<div className="title">{itemHeaderTitle}</div>}
            subHeader={itemHeaderDescription}
          />
          <div className="ui divider" style={{ margin: '5px 0px 0px 0px' }} />
          {children}
        </div>
      </div>
    </Grid>
  );
};

export default SideMenuLayout;
