import React from 'react';
import classNames from 'classnames';

const ActionInput = React.createClass({
	propTypes: {
		/**
		 * Button caption
		 */
		caption: React.PropTypes.string.isRequired,

		/**
		 * Button icon
		 */
		icon: React.PropTypes.string.isRequired,

		/**
		 * Input placeholder
		 */
		placeholder: React.PropTypes.string.isRequired,

		/**
		 * Function to call with the value
		 */
		handleAction: React.PropTypes.func.isRequired
	},

	handleClick() {
		this.props.handleAction(this.state.value);
	},

	getInitialState: function() {
		return {value: ""};
	},

	handleChange: function(event) {
		this.setState({value: event.target.value});
	},

	displayName: "ActionInput",
	render: function() {
		const buttonClass = classNames(
			"ui", 
			"button", 
			{ "disabled": this.state.value.length === 0 }
		);

		return (
			<div className="ui action input">
				<input type="text" placeholder={this.props.placeholder} onChange={this.handleChange}/>
				<button className={ buttonClass } onClick={ this.handleClick }>
					<i className={ this.props.icon + " icon" }></i>
					{ this.props.caption }
				</button>
			</div>
		);
	}
});

export default ActionInput;