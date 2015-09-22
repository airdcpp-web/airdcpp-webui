import React from 'react';
import { Checkbox } from 'react-semantify'

export default React.createClass({

  componentDidMount() {
    var settings = {
      fireOnInit: false
    };

    var dom = React.findDOMNode(this);
    $(dom).checkbox(settings);
  },

  render: function() {
    return (
      <Checkbox className="toggle">
        <input type="checkbox" {...this.props}/>
      </Checkbox>);
  }
});