import * as React from 'react';

import { ConfirmDialog, ConfirmDialogProps } from '@/components/semantic/ConfirmDialog';

export interface InputFieldProps extends Omit<ConfirmDialogProps, 'onApproved'> {
  onApproved: (inputValue: string) => Promise<void>;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

interface State {
  value: string;
}

export class InputDialog extends React.Component<InputFieldProps, State> {
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
      return Promise.reject(Error('Invalid input'));
    }

    return this.props.onApproved(this.state.value);
  };

  render() {
    const { onApproved, inputProps, ...other } = this.props;
    return (
      <ConfirmDialog onApproved={this.onApproved} {...other}>
        <form className="ui input dialog" name="input">
          <input
            ref={(c) => {
              this.c = c!;
            }}
            onChange={this.onChanged}
            {...inputProps}
          />

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
