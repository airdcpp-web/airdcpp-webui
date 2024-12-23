import * as React from 'react';

import Button, { ButtonProps } from 'components/semantic/Button';

export type SubmitCallback = (value: string) => void;

export interface ActionInputProps extends Omit<ButtonProps, 'type'> {
  // Function to call with the value
  handleAction: SubmitCallback;

  // Input placeholder
  placeholder: string;
  type?: string;
}

class ActionInput extends React.PureComponent<ActionInputProps> {
  static defaultProps: Pick<ActionInputProps, 'type'> = {
    type: 'text',
  };

  state = {
    value: '',
  };

  handleClick = () => {
    this.props.handleAction(this.state.value);
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: event.target.value });
  };

  render() {
    const { type, placeholder, handleAction, ...other /*icon, caption*/ } = this.props;
    return (
      <div className="ui action input">
        <input type={type} placeholder={placeholder} onChange={this.handleChange} />
        <Button
          {...other}
          icon={this.props.icon}
          caption={this.props.caption}
          onClick={this.handleClick}
          disabled={this.state.value.length === 0}
        />
      </div>
    );
  }
}

export default ActionInput;
