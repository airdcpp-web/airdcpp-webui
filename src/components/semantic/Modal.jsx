import React from 'react';
import { Button, Popup, Icon } from 'react-semantify'

import { Lifecycle } from 'react-router'
import { History } from 'react-router'

import classNames from 'classnames';

export default React.createClass({
  mixins: [ Lifecycle ],
  propTypes: {

    /**
     * Title of the modal
     */
    title: React.PropTypes.node.isRequired,

    /**
     * Icon to display
     */
    icon: React.PropTypes.string,

    /**
     * Close the modal when clicking outside its boundaries
     */
    closable: React.PropTypes.bool,

    /**
     * Function to call when the dialog is saved
     * If no handler is supplied, there will only be a plain close button
     */
    saveHandler: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      closable: true
    }
  },

  getInitialState() {
    return {
      saving: false
    }
  },

  routerWillLeave(nextLocation) {
    this.hide();
  },

  componentDidMount() {
    var settings = {
      onHidden: this.onHidden,
      movePopup:false,
      onApprove: this.onApprove,
      onDeny: this.onDeny,
      closable: this.props.closable,
      detachable: false,
      allowMultiple: false
    };

    var dom = React.findDOMNode(this);
    $(dom).modal(settings).modal('show');
  },

  onDeny: function (el) {
  },

  onApprove: function (el) {
    let { saveHandler } = this.props;
    if (saveHandler) {
      this.setState({ saving: true });
      let promise = saveHandler();
      promise.then(this.hide).catch(() => this.setState({ saving: false }));
      return false;
    }
  },

  hide() {
    var dom = React.findDOMNode(this);
    $(dom).modal('hide');
  },

  onHidden() {
    this.props.closeHandler();
  },

  render: function() {
   /* var saveButtonClass = classNames(
      "ui", 
      "button", 
      { "disabled": this._isDisabled() },
      { "loading": this.props.running }
    );*/

    return (
      <div className="ui long modal">
        <div className="header">
          <i className={ this.props.icon + " icon" }></i>
          { this.props.title }
        </div>
        <div className="content">
          { this.props.children }
        </div>

        {this.props.saveHandler ? (
          <div className="actions">
            <div className={ "ui ok green basic button " + (this.state.saving ? "loading" : "") }>
              <i className="checkmark icon"></i>
              Save
            </div>
            <div className="ui cancel red basic button">
              <i className="remove icon"></i>
              Cancel
            </div>
        </div>) : (
          <div className="actions">
            <div className="ui green basic button">
              <i className="checkmark icon"></i>
              Close
            </div>
          </div>
        )}
      </div>);
  }
});