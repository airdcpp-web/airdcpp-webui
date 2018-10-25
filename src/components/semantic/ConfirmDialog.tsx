import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import cx from 'classnames';

import Checkbox from 'components/semantic/Checkbox';

import 'semantic-ui-css/components/modal';
import 'semantic-ui-css/components/modal.min.css';
import Icon, { IconType } from 'components/semantic/Icon';
import { ModalRouteCloseContext } from 'decorators/ModalRouteDecorator';


type ApproveHandler = (checked: boolean) => void | false;
type RejectHandler = (error: Error) => void;

interface ConfirmDialogOptions {
  icon?: IconType;

  content?: React.ReactNode;
  title: React.ReactNode;

  approveCaption?: string;
  rejectCaption?: string;

  checkboxCaption?: React.ReactNode;
}

export interface ConfirmDialogProps extends ConfirmDialogOptions {
  onApproved: ApproveHandler;
  onRejected?: RejectHandler;
}

const NODE_ID = 'modals-node';
//const NODE_ID = 'confirms-node';

class ConfirmDialog extends React.Component<ConfirmDialogProps> {
  static contextType = ModalRouteCloseContext;

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
      dimmerSettings: {
        dimmerName: NODE_ID,
        //selector: {
        //  dimmer: `> .ui.dimmer.${NODE_ID}`
        //},
        //namespace: NODE_ID,
      },
      //namespace: NODE_ID,
      //debug: true,
      //verbose: true,
      //selector: {
        //dimmer: 
      //},
      //name: 'Confirm',
    };

    Object.assign(settings, {
      useFlex: false,
    });

    $(this.c).modal(settings).modal('show');
  }

  onDeny = () => {
    if (this.props.onRejected) {
      this.props.onRejected(new Error('Denied'));
    }
  }

  onApprove = () => {
    return this.props.onApproved(this.state.checked);
  }

  onCheckboxValueChanged = (value: boolean) => {
    this.setState({ checked: value });
  }

  render() {
    const { title, icon, checkboxCaption, rejectCaption, approveCaption, content, children } = this.props;

    // We can't use the basic (fully dimmed) style inside other modals
    const basic = !this.context;
    return ReactDOM.createPortal(
      (
        <div 
          ref={ c => this.c = c! } 
          className={ cx('ui modal confirm-dialog', { 'basic': basic }) }
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
              { children }
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
            <div className={ cx('two fluid ui buttons', { 'inverted': basic }) }>
              <div className={ cx('ui cancel red basic button', { 'inverted': basic }) }>
                <i className="remove icon"/>
                { rejectCaption }
              </div>
              <div className={ cx('ui ok green basic submit button', { 'inverted': basic }) }>
                <i className="checkmark icon"/>
                { approveCaption }
              </div>
            </div>
          </div>
        </div>
      ), 
      document.getElementById(NODE_ID)!
    );
  }
}

export { ConfirmDialog };
