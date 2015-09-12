import React from 'react';
import Portal from 'react-portal';
import { Button, Popup, Icon } from 'react-semantify'
import CSSPropertyOperations from 'react/lib/CSSPropertyOperations';

export default React.createClass({
  propTypes: {

    /**
     * Additional settings for the Semantic UI popup
     */
    settings: React.PropTypes.object,

    /**
     * Element that will trigger the popup when clicking on it
     */
    trigger: React.PropTypes.element.isRequired
  },

  componentDidMount: function() {
    // Create portal
    this.node = document.createElement('div');

    var className = "ui flowing popup ";
    if (this.props.className) {
      className += this.props.className;
    }

    this.node.className = className;

    if (this.props.style) {
      CSSPropertyOperations.setValueForStyles(this.node, this.props.style);
    }
    document.body.appendChild(this.node);


    // Init popup

    // Trigger
    var button = React.findDOMNode(this.refs.overlayTrigger);
    var parentRect = button.parentElement.getBoundingClientRect();

    // Common settings
    var settings = {
      movePopup:false,
      popup:this.node,
      on:'click',
      onShow:this.onShow,
      onHide:this.onHide,
      offset:parentRect.left
    };

    // Component settings
    if (this.props.settings) {
      Object.assign(settings, this.props.settings);
    }

    // Fix the position with this setting
    if (settings["position"] === 'bottom left') {
      settings["distanceAway"] = parentRect.top;
    }

    $(button).popup(settings);
  },

  onHide: function (el) {
    React.unmountComponentAtNode(this.node);
  },

  onShow: function (el) {
    React.render(this.props.children, this.node);
  },

  componentWillUnmount() {
    if (this.node) {
      React.unmountComponentAtNode(this.node);
      document.body.removeChild(this.node);
    }

    this.node = null;
  },

  render: function() {
    this.trigger = React.cloneElement(this.props.trigger, {ref: "overlayTrigger", onClick: this.onShow })
    return (<div>
      {this.trigger}
    </div>);
  }
});