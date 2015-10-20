import React from 'react';

const NewLayout = React.createClass({
  propTypes: {
    /**
     * Title of the button
     */
    title: React.PropTypes.any.isRequired,

    /**
     * Title of the button
     */
    subheader: React.PropTypes.any,
  },

  displayName: "SidebarNewLayout",
  render: function() {
    return (
      <div className="new-layout">
      	<h2 className="ui header new">
	      	<i className={ this.props.icon + " icon" }></i>
	      	<div className="content">
		        {this.props.title}
		        { this.props.subheader ? <div className="sub header">{ this.props.subheader }</div> : null }
	        </div>
        </h2>
        {this.props.children}
      </div>
    );
  }
});

export default NewLayout