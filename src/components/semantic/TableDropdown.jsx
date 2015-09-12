import React from 'react';
import { Icon } from 'react-semantify'
import Popup from './Popup'

// A popup-based class for handling dropdowns in Fixed Data Table
// The normal styled dropdown won't work there because the table cell won't allow overflow
// https://github.com/facebook/fixed-data-table/issues/180

export default React.createClass({
  propTypes: {
    /**
     * Cell content to render
     */
    caption: React.PropTypes.node.isRequired
  },

  render: function() {
     var trigger = (<div>
      {this.props.caption}
      <i className="dropdown icon"></i>
      </div>);

    var settings = {
      position:'bottom left',
      lastResort:true
    };

    return (<Popup className="basic" trigger={trigger} settings={ settings }>
      {this.props.children}
    </Popup>);
  }
});