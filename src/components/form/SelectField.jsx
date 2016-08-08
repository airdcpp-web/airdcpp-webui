'use strict';

import React from 'react';
import Select from 'react-select';

import t from 'utils/tcomb-form';

import 'react-select/dist/react-select.css';


const TagValue = React.createClass({
	propTypes: {
		value: React.PropTypes.object,
	},

	onClick() {
		this.props.onRemove(this.props.value);
	},

	render() {
		return (
			<a className="ui label" onClick={this.onClick}>
				{ this.props.children }
				<i className="delete icon"/>
			</a>
		);
	}
});

const ReactSelect = t.form.Form.templates.select.clone({
	renderSelect: (locals) => { // <- locals contains the "recipe" to build the UI
		const onChange = (values) => {
			locals.onChange(values.map(value => value.value, []));
		};

		// translate the option model from tcomb to react-select
		const options = locals.options.map(({ value, text }) => ({ value, label: text }));

		return (
			<Select
				value={locals.value}
				options={options}
				onChange={onChange}
				multi={true}
				valueComponent={TagValue}
				noResultsText={null}
			/>
		);
	}
});

export default ReactSelect;
