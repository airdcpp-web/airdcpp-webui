import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import Checkbox from 'components/semantic/Checkbox';

import 'semantic-ui/components/modal';
import 'semantic-ui/components/modal.min.css';


const ConfirmDialog = React.createClass({
  propTypes: {

    /**
		 * Title of the modal
		 */
    title: PropTypes.node.isRequired,

    /**
		 * Content of the modal
		 */
    content: PropTypes.node.isRequired,

    /**
		 * Icon to display
		 */
    icon: PropTypes.string,

    approveCaption: PropTypes.string,
    rejectCaption: PropTypes.string,

    onApproved: PropTypes.func.isRequired,
    onRejected: PropTypes.func,

    /**
		 * Display a textbox if the caption is supplied
		 * The checkbox value will be provided as an argument when the promise is resolved
		 */
    checkboxCaption: PropTypes.node,
  },

  getDefaultProps() {
    return {
      approveCaption: 'Yes',
      rejectCaption: 'No',
    };
  },

  getInitialState() {
    return {
      checked: false,
    };
  },

  componentDidMount() {
    // We can't use the same context as for modals
    // because the dimmer wouldn't work correctly then
    // (the new dimmer would never be set active because the dimmable object is set to dimmed already)
    // Track https://github.com/Semantic-Org/Semantic-UI/issues/4055
    const settings = {
      context: '#container-main',
      movePopup: false,
      onHidden: this.onHidden,
      onApprove: this.onApprove,
      onDeny: this.onDeny,
      closable: false,
      detachable: false,
      allowMultiple: true,
      //debug: true,
      //verbose: true,
      //name: 'Confirm',
      dimmerSettings: {
        dimmerName: 'confirm',
      },
    };

    $(this.c).modal(settings).modal('show');
  },

  onDeny: function (el) {
    if (this.props.onRejected) {
      this.props.onRejected(new Error('Denied'));
    }
  },

  onApprove: function (el) {
    this.props.onApproved(this.state.checked);
  },

  onHidden() {
    if (this.props.node) {
      ReactDOM.unmountComponentAtNode(this.props.node);
      document.body.removeChild(this.props.node);
    }
  },

  onCheckboxValueChanged(value) {
    this.setState({ checked: value });
  },

  render: function () {
    return (
      <div 
        ref={ c => this.c = c } 
        className="ui basic modal confirm-dialog"
      >
        <div className="header">
          { this.props.title }
        </div>
        <div className="image content">
          <div className="image">
            <i className={ this.props.icon + ' icon'}/>
          </div>
          <div className="description">
            { this.props.content }
            { this.props.checkboxCaption ? (	
              <Checkbox 
                checked={false} 
                onChange={ this.onCheckboxValueChanged }
                caption={ this.props.checkboxCaption }
              />
            ) : null }
          </div>
        </div>
        <div className="actions">
          <div className="two fluid ui inverted buttons">
            <div className="ui cancel red basic inverted button">
              <i className="remove icon"/>
              { this.props.rejectCaption }
            </div>
            <div className="ui ok green basic inverted button">
              <i className="checkmark icon"/>
              { this.props.approveCaption }
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default function (options, onApproved, onRejected) {
  const node = document.createElement('div');
  const dialog = (
    <ConfirmDialog 
      node={ node } 
      onApproved={ onApproved }
      onRejected={ onRejected }
      { ...options }
    />
  );

  document.body.appendChild(node);

  ReactDOM.render(dialog, node);
}
