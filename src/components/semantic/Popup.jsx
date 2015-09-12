/*import React from 'react';
import Portal from 'react-portal';
import { Button, Popup, Icon } from 'react-semantify'

export default React.createClass({
  componentWillUpdate: function() {
    //var node = React.findDOMNode(this.refs.messageList);
    //this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  },
   
  componentDidUpdate: function() {
    //if (this.shouldScrollBottom) {
    //  var node = React.findDOMNode(this.refs.messageList);
    //  node.scrollTop = node.scrollHeight
    //}
  },

  componentWillMount() {
    var button = $(React.findDOMNode(this.refs.overlayTrigger));
    button.popup({
      content: this.props.content
    });

    var tmp = button;
  },

  render: function() {
    return (
      <Portal {...this.props} closeOnEsc={true} closeOnOutsideClick={true}>
        <div className="ui popup flowing top left transition visible">
          {this.props.children}
        </div>
      </Portal>
    );
  }
});*/

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

    // Componenet settings
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

    /*if (this.props.openByClickOn) {
      return <div className="openByClickOn" onClick={this.openPortal.bind(this, this.props)}>{this.props.openByClickOn}</div>;
    } else {
      return null;
    }*/


    /*return (
      <Portal {...this.props} ref="verycustom">
        <div className="ui popup flowing top left transition visible">
          {this.props.children}
        </div>
      </Portal>
    );*/
  }
});