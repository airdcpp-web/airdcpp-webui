import React from 'react';
import { Icon } from 'react-semantify'
import Popup from './Popup'
import classNames from 'classnames';

// A popup-based class for handling dropdowns in Fixed Data Table
// The normal styled dropdown won't work there because the table cell won't allow overflow
// https://github.com/facebook/fixed-data-table/issues/180

export var DropdownItem = React.createClass({
  render() {
    const className = classNames(
      "item",
      this.props.className,
      { "active": this.props.active  }
    );

    return (
      <a className={ className } {...this.props}>
        {this.props.children}
      </a>
    );
  }
});

export default React.createClass({
  propTypes: {
    /**
     * Cell content to render
     */
    caption: React.PropTypes.node.isRequired
  },

  addCloseHandler(elem) {
    return React.cloneElement(elem, {
      onClick: () => {
        this.refs.dropdownMenu.hide();
        
        elem.props.onClick();
      } 
    })
  },

  render: function() {
    // Caption
    const trigger = (
      <div className="table-dropdown">
        {this.props.caption}
        <i className="dropdown icon"></i>
      </div>);

    // Settings
    const settings = {
      position:'bottom left',
      lastResort:true
    };

    return (
      <Popup className="basic" trigger={trigger} settings={ settings } ref="dropdownMenu">
        <div className="ui text menu vertical">
        <div className="ui dropdown item">
          { this.props.children.map(this.addCloseHandler) }
        </div>
        </div>
      </Popup>);
}
});