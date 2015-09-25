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

  createPortal: function() {
    // Create portal
    this.node = document.createElement('div');

    let className = "ui flowing popup ";
    if (this.props.className) {
      className += this.props.className;
    }

    this.node.className = className;

    if (this.props.style) {
      CSSPropertyOperations.setValueForStyles(this.node, this.props.style);
    }
    document.body.appendChild(this.node);
  },

  getInitialState: function() {
    return {
      active: false
    };
  },

  componentWillUpdate: function(nextProps, nextState) {
    if (nextState.active && !this.state.active) {
      this.show();
    } else if (!nextState.active && this.state.active) {
      this.hide();
    }
  },

  hide: function() {
    let button = React.findDOMNode(this.refs.overlayTrigger);
    $(button).popup('destroy');

    React.unmountComponentAtNode(this.node);
  },

  show: function() {
    this.createPortal();

    React.render(this.props.children, this.node);

    // Trigger
    let button = React.findDOMNode(this.refs.overlayTrigger);
    const parentRect = button.parentElement.getBoundingClientRect();

    // Common settings
    let settings = {
      on:'click',
      movePopup:false,
      popup:this.node,
      onHidden: () => this.setState({active:false}),
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

    $(button).popup(settings).popup('show');
  },

  handleClick: function (el) {
    this.setState({active: !this.state.active});
  },

  componentWillUnmount() {
    if (this.node) {
      React.unmountComponentAtNode(this.node);
      document.body.removeChild(this.node);
    }

    this.node = null;
  },

  render: function() {
    this.trigger = React.cloneElement(this.props.trigger, {ref: "overlayTrigger", onClick: this.handleClick })
    return (<div>
      {this.trigger}
    </div>);
  }
});