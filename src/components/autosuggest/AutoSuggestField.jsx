import React from 'react';

import Autosuggest from 'react-autosuggest';

import t from 'utils/tcomb-form';

import './style.css';

const AutoSuggestField = t.form.Form.templates.textbox.clone({
	renderInput(locals) {
		let getSuggestions = (input, callback) => {
			const regex = new RegExp('^' + input, 'i');
			const suggestions = locals.attrs.suggestionGetter().filter(str => regex.test(str));

			callback(null, suggestions);
		};

		const handleChange = (value) => {
			locals.onChange(value);
		};

		// Hide suggestions after submitting input
		const showWhen = (input) => {
			return true;
		};

		const inputAttributes = {
			placeholder: locals.attrs.placeholder,
			onChange: handleChange,
		};

		return (
			<Autosuggest 
				value={locals.value ? locals.value : '' }
				showWhen={showWhen}
				suggestions={getSuggestions}
				inputAttributes={inputAttributes} 
			/>
		);
	}
});

export default AutoSuggestField;