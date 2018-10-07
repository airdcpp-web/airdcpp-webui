//import PropTypes from 'prop-types';
import React from 'react';

import LayoutHeader from 'components/semantic/LayoutHeader';
import { SessionMainLayoutProps } from './SessionLayout';


const SideMenuLayout: React.SFC<SessionMainLayoutProps<any /*SessionT*/>> = ({ 
  sessionMenuItems, newButton,
  itemHeaderIcon, itemHeaderTitle, children,
  itemHeaderDescription, onKeyDown,
}) => {

  if (newButton) {
    newButton = React.cloneElement(newButton, { 
      className: newButton.props.className + ' ui fluid button' 
    });
  }

  return (
    <div className="ui grid session-container horizontal" onKeyDown={ onKeyDown }>
      <div className="four wide column menu-column">
        { newButton }
        { !!sessionMenuItems.length && (
          <div className="ui vertical secondary menu">
            { sessionMenuItems}
          </div>
        )
        }
      </div>
      <div className="twelve wide stretched column content-column session">
        <div className="ui segment session-layout">
          <LayoutHeader
            className="session-header"
            icon={ itemHeaderIcon }
            title={ <div className="title">{ itemHeaderTitle }</div> }
            subHeader={ itemHeaderDescription }
          />
          <div className="ui divider"/>
          { children }
        </div>
      </div>
    </div>
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
