'use strict';

import React from 'react';

//import '../style.css'

const MessageView = React.createClass({
  displayName: "Sidebar",
  render() {
    return (
      <div id="sidebar" className="ui right vertical overlay sidebar">
        <div id="sidebar-container">
          <div>
            { this.props.children }
          </div>
        </div>
      </div>
    );
  },
});

export default MessageView
