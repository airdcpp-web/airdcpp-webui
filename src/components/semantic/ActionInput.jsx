import PropTypes from 'prop-types';
import React from 'react';

import Button from 'components/semantic/Button';

class ActionInput extends React.PureComponent {
  static propTypes = {
    /**
		 * Button caption
		 */
    caption: PropTypes.string.isRequired,

    /**
		 * Button icon
		 */
    icon: PropTypes.string.isRequired,

    /**
		 * Input placeholder
		 */
    placeholder: PropTypes.string.isRequired,

    /**
		 * Function to call with the value
		 */
    handleAction: PropTypes.func.isRequired
  };

  static defaultProps = {
    type: 'text',
  };

  state = { 
    value: '' 
  };

  handleClick = () => {
    this.props.handleAction(this.state.value);
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  render() {
    return (
      <div className="ui action input">
        <input 
          type={ this.props.type }
          placeholder={this.props.placeholder} 
          onChange={this.handleChange}
        />
        <Button
          icon={ this.props.icon }
          onClick={ this.handleClick }
          caption={ this.props.caption }
          disabled={this.state.value.length === 0}
        />
      </div>
    );
  }
}

export default ActionInput;
