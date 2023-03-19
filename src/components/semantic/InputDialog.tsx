//import PropTypes from 'prop-types';
import * as React from 'react';

import { ConfirmDialog, ConfirmDialogProps } from 'components/semantic/ConfirmDialog';

export interface InputFieldProps extends Omit<ConfirmDialogProps, 'onApproved'> {
  onApproved: (inputValue: string) => void | false;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

interface State {
  value: string;
}

export class InputDialog extends React.Component<InputFieldProps, State> {
  /*static propTypes = {
    // Action description
    content: PropTypes.node.isRequired,
  };*/

  constructor(props: InputFieldProps) {
    super(props);

    const { inputProps } = props;
    this.state = {
      value: !!inputProps.defaultValue ? (inputProps.defaultValue as string) : '',
    };
  }

  c: HTMLInputElement;
  state: State = {
    value: '',
  };

  onChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      value: event.target.value,
    });
  };

  onApproved = () => {
    if (!this.c.reportValidity()) {
      return false;
    }

    const success = this.props.onApproved(this.state.value);
    return success;
  };

  render() {
    const { onApproved, inputProps, ...other } = this.props;
    return (
      <ConfirmDialog onApproved={this.onApproved} {...other}>
        <form className="ui input dialog">
          <input ref={(c) => (this.c = c!)} onChange={this.onChanged} {...inputProps} />

          {/* 
          // A hack to cheat browser not to use autofill for the real password field
          // (some browsers can be really desperate with finding login forms...)
          // https://github.com/airdcpp-web/airdcpp-webclient/issues/100
          */}
          {inputProps.type === 'password' && (
            <div>
              <input style={{ display: 'none' }} />
              <input type="password" style={{ display: 'none' }} />
            </div>
          )}
        </form>
      </ConfirmDialog>
    );
  }
}
