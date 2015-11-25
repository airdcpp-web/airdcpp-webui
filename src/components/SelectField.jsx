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
				<i className="delete icon"></i>
			</a>
		);
	}
});

//class ReactSelect extends t.form.Select {

const ReactSelect = t.form.Form.templates.select.clone({
	renderSelect: (locals) => { // <- locals contains the "recipe" to build the UI
		const onChange = (values) => {
			locals.onChange(values ? values.map(value => value.value, []) : null);
		};

		// translate the option model from tcomb to react-select
		const options = locals.options.map(({ value, text }) => ({ value, label: text }));

		return (
			<Select
				//name={locals.attrs.name}
				value={locals.value}
				options={options}
				onChange={onChange}
				multi={true}
				valueComponent={TagValue}
			/>
		);
	}
});

export default ReactSelect;
