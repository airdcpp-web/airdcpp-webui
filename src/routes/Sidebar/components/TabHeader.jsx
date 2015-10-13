import React from 'react';

const TabHeader = React.createClass({
  propTypes: {
    /**
     * Header title
     */
    title: React.PropTypes.node.isRequired,

    /**
     * Subheader
     */
    subHeader: React.PropTypes.node.isRequired,

    /**
     * Icon to display
     */
    icon: React.PropTypes.node.isRequired,

    /**
     * Icon to display
     */
    closeHandler: React.PropTypes.func.isRequired,
  },

  render() {
    return (
      <div className="tab-header">
        <h2 className="ui header">
          { this.props.icon }
          <div className="content">
            { this.props.title }
            <div className="sub header">{ this.props.subHeader }</div>
          </div>
        </h2>
        <div className="ui button" onClick={this.props.closeHandler}>
          Close
        </div>
      </div>
    );
  },
});

export default TabHeader