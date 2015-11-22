import React from 'react';

const t = require('tcomb-form');

const getOption = (opt) => {
	return <option key={opt.value} value={opt.value}>{opt.text}</option>;
};

class SelectBoolField extends t.form.Select {
	getTemplate() {
		return (locals) => {
			const value = this.props.value;
			const checked = value === this.props.options.checkboxValueId;

			const onSelectValueChanged = (event) => {
				locals.onChange(event.target.value);
			};

			const getSelect = () => {
				const options = locals.options.filter(x => x.value !== this.props.options.checkboxValueId).map(getOption);
				return (
					<select 
						//className={className}
						disabled={ checked || this.props.options.disabled }
						onChange={ onSelectValueChanged }
						value={locals.value}
					>
						{ options }
					</select>
				);
			};

			const onCheckboxValueChanged = (event) => {
				locals.onChange(event.target.checked ? this.props.options.checkboxValueId : null);
			};

			const getCheckbox = () => {
				return (
					<div className="ui checkbox">
						<input type="checkbox" checked={ checked } onChange={onCheckboxValueChanged}/>
						<label className="label">{this.props.options.checkboxLabel}</label>
					</div>
				);
			};

			let className = 'field select-checkbox';
			if (locals.hasError) {
				className += ' has-error';
			}

			return (
				<div className={className}>
					<label className="label">{locals.label}</label>
					<div className="ui">
						{ getSelect() }
						{ locals.help ? <div className="ui pointing label visible">{locals.help}</div> : null }
						{ getCheckbox() }
						{ locals.error }
					</div>
				</div>
			);
		};
	}
}

export default SelectBoolField;