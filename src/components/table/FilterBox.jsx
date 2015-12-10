import React from 'react';

import TableFilterDecorator from 'decorators/TableFilterDecorator';

const FilterBox = React.createClass({
	propTypes: {
		viewUrl: React.PropTypes.string.isRequired,
		customFilter: React.PropTypes.node,
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
		let customFilter = null;
		if (this.props.customFilter) {
			customFilter = React.cloneElement(this.props.customFilter, { 
				viewUrl: this.props.viewUrl, 
			});
		}

		return (
			<div className="filter">
				{ customFilter }
				<div className="ui input" onChange={this.handleChange} value={this.state.value}>
					<input placeholder="Filter..." type="text"/>
				</div>
			</div>
		);
	}
});

export default TableFilterDecorator(FilterBox);