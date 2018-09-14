import PropTypes from 'prop-types';
import React from 'react';

import Button, { ButtonProps } from 'components/semantic/Button';


export interface ActionInputProps extends ButtonProps {
  handleAction: (value: string) => void;
  placeholder: string;
  type?: string;
}

class ActionInput extends React.PureComponent<ActionInputProps> {
  static propTypes = {
    // Button caption
    caption: PropTypes.string.isRequired,

    // Button icon
    icon: PropTypes.string.isRequired,

    // Input placeholder
    placeholder: PropTypes.string.isRequired,

    // Function to call with the value
    handleAction: PropTypes.func.isRequired
  };

  static defaultProps: Partial<ActionInputProps> = {
    type: 'text',
  };

  state = { 
    value: '' 
  };

  handleClick = () => {
    this.props.handleAction(this.state.value);
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: event.target.value });
  }

  render() {
    const { type, placeholder, handleAction, ...other /*icon, caption*/ } = this.props;
    return (
      <div className="ui action input">
        <input 
          type={ type }
          placeholder={ placeholder } 
          onChange={ this.handleChange }
        />
        <Button
          { ...other }
          icon={ this.props.icon }
          caption={ this.props.caption }
          onClick={ this.handleClick }
          disabled={this.state.value.length === 0}
        />
      </div>
    );
  }
}

export default ActionInput;
