import React from 'react';

import { FilterMethod } from 'constants/TableConstants';

import Dropdown from 'components/semantic/Dropdown';
import { MenuItemLink } from 'components/semantic/MenuItem';

import TableFilterDecorator from 'decorators/TableFilterDecorator';


const filterMethodToString = (method) => {
	switch (method) {
		case FilterMethod.REGEX: return 'Regex';
		case FilterMethod.WILDCARD: return 'Wildcard';
		case FilterMethod.EXACT: return 'Exact';
		default: return 'Partial';
	}
};

const getPlaceholder = (method) => {
	let ret = 'Filter';
	if (method !== FilterMethod.PARTIAL) {
		ret += ' (' + filterMethodToString(method).toLowerCase() + ')';
	}

	return ret + '...';
};

const FilterBox = React.createClass({
	propTypes: {
		viewUrl: React.PropTypes.string.isRequired,
	},

	getInitialState: function () {
		return { 
			value: '',
			method: FilterMethod.PARTIAL,
		};
	},

	componentWillMount: function () {
		this._timer = null;
	},

	componentWillUnmount: function () {
		clearTimeout(this._timer);
	},

	onFilterUpdated() {
		const { value, method } = this.state;
		this.props.onFilterUpdated(value, method);
	},

	onTextChanged: function (event) {
		this.setState({ 
			value: event.target.value 
		});

		clearTimeout(this._timer);

		this._timer = setTimeout(() => {
			this._timer = null;
			this.onFilterUpdated();
		}, 200);
	},

	onMethodChanged(method) {
		this.setState({ 
			method,
		});

		setTimeout(_ => this.onFilterUpdated());
		this.refs.input.focus();
	},

	getFilterMethod(method) {
		const isCurrent = method === this.state.method;
		return (
			<MenuItemLink 
				key={ method }
				onClick={ () => this.onMethodChanged(method) }
				active={ isCurrent }
			>
				{ filterMethodToString(method) }
			</MenuItemLink>
		);
	},

	render: function () {
		return (
			<div className="text-filter">
				<div 
					className="ui action input" 
					onChange={ this.onTextChanged } 
					value={ this.state.value }
				>
					<input 
						ref="input"
						placeholder={ getPlaceholder(this.state.method) } 
						type="text"
					/>
					<Dropdown 
						className="filter-method right top pointing"
						button={ true }
						direction="upward"
					>
						<div className="header">Match type</div>
						{ Object.keys(FilterMethod)
							.map(key => this.getFilterMethod(FilterMethod[key])) }
					</Dropdown>
				</div>
			</div>
		);
	}
});

export default TableFilterDecorator(FilterBox);