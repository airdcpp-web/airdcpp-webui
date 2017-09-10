import PropTypes from 'prop-types';
import React from 'react';

import Button from 'components/semantic/Button';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const ActionInput = React.createClass({
  mixins: [ PureRenderMixin ],
  propTypes: {
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
  },

  handleClick() {
    this.props.handleAction(this.state.value);
  },

  getDefaultProps() {
    return {
      type: 'text',
    };
  },

  getInitialState: function () {
    return { 
      value: '' 
    };
  },

  handleChange: function (event) {
    this.setState({ value: event.target.value });
  },

  render: function () {
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
});

export default ActionInput;
