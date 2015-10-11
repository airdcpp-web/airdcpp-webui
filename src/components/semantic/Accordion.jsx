import React from 'react';

const Accordion = React.createClass({
  componentDidMount() {
    let dom = React.findDOMNode(this);
    $(dom).accordion();
  },

  getDefaultProps() {
    return {
      className: ""
    }
  },

  render: function() {
    return (
      <div className={ "ui accordion " + this.props.className }>
        { this.props.children }
      </div>
    );
  }
});

export default Accordion