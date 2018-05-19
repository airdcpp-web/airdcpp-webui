import PropTypes from 'prop-types';
import React from 'react';

import ConfirmDialog, { ConfirmDialogOptions } from 'components/semantic/ConfirmDialog';


export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  content: React.ReactNode;
}

class InputField extends React.Component<InputFieldProps> {
  static propTypes = {
    /**
		 * Action description
		 */
    content: PropTypes.node.isRequired,
  };

  render() {
    const { content, ...other } = this.props;
    return (
      <div className="ui input dialog">
        { content }
        <input { ...other}/>
      </div>
    );
  }
}

type InputDialogOptions = Pick<ConfirmDialogOptions, 'icon' | 'approveCaption' | 'content' | 'title'>;

const InputDialog = function (dialogOptions: InputDialogOptions, inputOptions: React.InputHTMLAttributes<HTMLInputElement>, onApproved: (value: string) => void) {
  let inputText: string = inputOptions.defaultValue && typeof inputOptions.defaultValue === 'string' ? inputOptions.defaultValue : '';

  const input = (
    <InputField 
      { ...inputOptions } 
      content={ dialogOptions.content } 
      onChange={(event) => inputText = event.target.value }
    />
  );

  ConfirmDialog({
    ...dialogOptions,
    rejectCaption: 'Cancel',
    content: input,
  }, () => onApproved(inputText));
};

export const PasswordDialog = function (title: React.ReactNode, text: React.ReactNode, onApproved: (value: string) => void) {
  const dialogOptions: InputDialogOptions = {
    icon: 'yellow lock',
    approveCaption: 'Set password',

    // A hack to cheat browser not to use autofill for the real password field
    // (some browsers can be really desperate with finding login forms...)
    // https://github.com/airdcpp-web/airdcpp-webclient/issues/100
    content: (
      <div>
        <input style={{ display: 'none' }}/>
        <input type="password" style={{ display: 'none' }}/>
        { text }
      </div>
    ),
    title: title,
  };

  const inputOptions = {
    placeholder: 'Enter password',
    type: 'password',
  };

  InputDialog(dialogOptions, inputOptions, onApproved);
};

export default InputDialog;