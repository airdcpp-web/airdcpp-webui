import React from 'react';

const Dropdown = React.createClass({
  componentDidMount() {
    let dom = React.findDOMNode(this);
    $(dom).dropdown();
  },

  getDefaultProps() {
    return {
      className: ""
    }
  },

  render: function() {
    return (
      <div className={ "ui dropdown " + this.props.className }>
        { this.props.children }
      </div>
    );
  }
});

export default Dropdown