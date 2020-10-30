//import PropTypes from 'prop-types';
import * as React from 'react';

import LayoutHeader from 'components/semantic/LayoutHeader';
import { SessionMainLayoutProps } from './SessionLayout';
import { Grid } from 'components/semantic/Grid';


const SideMenuLayout: React.FC<SessionMainLayoutProps<any /*SessionT*/>> = ({ 
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
    <Grid 
      className="session-container horizontal" 
      onKeyDown={ onKeyDown }
    >
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
          <div className="ui divider" style={{ margin: '5px 0px 0px 0px' }}/>
          { children }
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
