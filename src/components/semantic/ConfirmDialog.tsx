import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import Checkbox from 'components/semantic/Checkbox';

import 'semantic-ui-css/components/modal';
import 'semantic-ui-css/components/modal.min.css';
import Icon, { IconType } from 'components/semantic/Icon';


type ApproveHandler = (checked: boolean) => void;
type RejectHandler = (error: Error) => void;

export interface ConfirmDialogOptions {
  icon?: IconType;

  content?: React.ReactNode;
  title: React.ReactNode;

  approveCaption?: string;
  rejectCaption?: string;

  checkboxCaption?: React.ReactNode;
}

interface ConfirmDialogProps extends ConfirmDialogOptions {
  onApproved: ApproveHandler;
  onRejected?: RejectHandler;
}

class ConfirmDialog extends React.Component<ConfirmDialogProps> {
  static propTypes = {

    // Title of the modal
    title: PropTypes.node.isRequired,

    // Content of the modal
    content: PropTypes.node.isRequired,

    // Icon to display
    icon: PropTypes.string,

    approveCaption: PropTypes.string,
    rejectCaption: PropTypes.string,

    onApproved: PropTypes.func.isRequired,
    onRejected: PropTypes.func,

    // Display a textbox if the caption is supplied
    // The checkbox value will be provided as an argument when the promise is resolved
    checkboxCaption: PropTypes.node,
  };

  static defaultProps: Pick<ConfirmDialogProps, 'approveCaption' | 'rejectCaption'> = {
    approveCaption: 'Yes',
    rejectCaption: 'No',
  };

  state = {
    checked: false,
  };

  c: HTMLDivElement;
  componentDidMount() {
    // We can't use the same context as for modals
    // because the dimmer wouldn't work correctly then
    // (the new dimmer would never be set active because the dimmable object is set to dimmed already)
    // Track https://github.com/Semantic-Org/Semantic-UI/issues/4055
    const settings: SemanticUI.ModalSettings = {
      //context: '#container-main',
      onApprove: this.onApprove,
      onDeny: this.onDeny,
      closable: false,
      detachable: false,
      allowMultiple: true,
      onHidden: this.onHidden,
      //debug: true,
      //verbose: true,
      //name: 'Confirm',
      dimmerSettings: {
        dimmerName: 'confirms-node',
      },
    };

    $(this.c).modal(settings).modal('show');
  }

  onHidden = () => {
    const element = document.getElementById('confirms-node');
    if (!!element) {
      ReactDOM.unmountComponentAtNode(element);
    }
  }

  onDeny = () => {
    if (this.props.onRejected) {
      this.props.onRejected(new Error('Denied'));
    }
  }

  onApprove = () => {
    this.props.onApproved(this.state.checked);
  }

  onCheckboxValueChanged = (value: boolean) => {
    this.setState({ checked: value });
  }

  render() {
    const { title, icon, checkboxCaption, rejectCaption, approveCaption, content } = this.props;
    return (
      <div 
        ref={ c => this.c = c! } 
        className="ui basic modal confirm-dialog"
      >
        <div className="header">
          { title }
        </div>
        <div className="image content">
          <div className="image">
            <Icon icon={ icon }/>
          </div>
          <div className="description">
            { content }
            { !!checkboxCaption && (	
              <Checkbox 
                checked={ false } 
                onChange={ this.onCheckboxValueChanged }
                caption={ checkboxCaption }
              />
            ) }
          </div>
        </div>
        <div className="actions">
          <div className="two fluid ui inverted buttons">
            <div className="ui cancel red basic inverted button">
              <i className="remove icon"/>
              { rejectCaption }
            </div>
            <div className="ui ok green basic inverted button">
              <i className="checkmark icon"/>
              { approveCaption }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default function (options: ConfirmDialogOptions, onApproved: ApproveHandler, onRejected?: RejectHandler) {
  const dialog = (
    <ConfirmDialog 
      onApproved={ onApproved }
      onRejected={ onRejected }
      { ...options }
    />
  );

  ReactDOM.render(dialog, document.getElementById('confirms-node'));
}
