import React from 'react';

import TableFilterDecorator from 'decorators/TableFilterDecorator';

const FilterBox = React.createClass({
	propTypes: {
		viewUrl: React.PropTypes.string.isRequired,
	},

	getInitialState: function () {
		return { value: '' };
	},

	componentWillMount: function () {
		this._timer = null;
	},

	componentWillUnmount: function () {
		clearTimeout(this._timer);
	},

	handleChange: function (event) {
		this.setState({ value: event.target.value });

		clearTimeout(this._timer);

		this._timer = setTimeout(() => {
			this._timer = null;
			this.props.onFilterUpdated(this.state.value);
		}, 200);
	},

	render: function () {
		return (
			<div className="ui input" onChange={this.handleChange} value={this.state.value}>
				<input placeholder="Filter..." type="text"/>
			</div>
		);
	}
});

export default TableFilterDecorator(FilterBox);