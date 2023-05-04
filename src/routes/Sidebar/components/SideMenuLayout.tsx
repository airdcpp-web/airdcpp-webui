//import PropTypes from 'prop-types';
import * as React from 'react';

import LayoutHeader from 'components/semantic/LayoutHeader';
import { Grid } from 'components/semantic/Grid';

import * as UI from 'types/ui';
import { SessionMainLayoutProps } from './types';

const SideMenuLayout = <
  SessionT extends UI.SessionItemBase,
  SessionApiT extends object,
  UIActionsT extends UI.ActionListType<UI.SessionItemBase>
>({
  sessionMenuItems,
  newButton,
  itemHeaderIcon,
  itemHeaderTitle,
  children,
  itemHeaderDescription,
  onKeyDown,
}: SessionMainLayoutProps<SessionT, SessionApiT, UIActionsT>) => {
  if (newButton) {
    newButton = React.cloneElement(newButton, {
      className: newButton.props.className + ' ui fluid button',
    });
  }

  return (
    <Grid className="session-container horizontal" onKeyDown={onKeyDown} tabIndex={0}>
      <div className="four wide column menu-column">
        {newButton}
        {!!sessionMenuItems.length && (
          <div className="ui vertical secondary menu">{sessionMenuItems}</div>
        )}
      </div>
      <div className="twelve wide stretched column content-column session">
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

/*SideMenuLayout.propTypes = {
  newButton: PropTypes.node,
  sessionMenuItems: PropTypes.array.isRequired,

  itemHeaderTitle: PropTypes.node,
  itemHeaderIcon: PropTypes.node,
  itemHeaderDescription: PropTypes.node.isRequired,
};*/

export default SideMenuLayout;
