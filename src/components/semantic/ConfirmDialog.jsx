import React from 'react';
import { Button, Popup, Icon } from 'react-semantify'
import CSSPropertyOperations from 'react/lib/CSSPropertyOperations';

import BlueBird from 'bluebird';

var ConfirmDialog = React.createClass({
  propTypes: {

    /**
     * Title of the modal
     */
    title: React.PropTypes.node.isRequired,

    /**
     * Content of the modal
     */
    text: React.PropTypes.node.isRequired,

    /**
     * Icon to display
     */
    icon: React.PropTypes.string
  },

  componentDidMount() {
    var settings = {
      movePopup:false,
      onHidden:this.onHidden,
      onApprove: this.onApprove,
      onDeny: this.onDeny,
      closable: false,
      detachable: false,
      allowMultiple: true
    };

    var dom = React.findDOMNode(this);
    $(dom).modal(settings).modal('show');
  },

  onDeny: function (el) {
    this.props.resolver.reject();
  },

  onApprove: function (el) {
    this.props.resolver.resolve();
  },

  onHidden() {
    if (this.props.node) {
      React.unmountComponentAtNode(this.props.node);
      document.body.removeChild(this.props.node);
    }
  },

  render: function() {
    return (<div className="ui basic modal">
      <div className="header">
        { this.props.title }
      </div>
      <div className="image content">
        <div className="image">
          <i className={ this.props.icon + " icon"}></i>
        </div>
        <div className="description">
          { this.props.text }
        </div>
      </div>
      <div className="actions">
        <div className="two fluid ui inverted buttons">
          <div className="ui cancel red basic inverted button">
            <i className="remove icon"></i>
            { this.props.rejectText }
          </div>
          <div className="ui ok green basic inverted button">
            <i className="checkmark icon"></i>
            { this.props.acceptText }
          </div>
        </div>
      </div>
    </div>);
  }
});

export default function (title, text, icon, acceptText="Yes", rejectText="No") {
  var resolver = BlueBird.pending();
  var node = document.createElement('div');
  var dialog = <ConfirmDialog node={node} title={title} resolver={ resolver } text={ text } icon={ icon } acceptText={acceptText} rejectText={rejectText}/>

  document.body.appendChild(node);

  React.render(dialog, node);
  return resolver.promise;
}