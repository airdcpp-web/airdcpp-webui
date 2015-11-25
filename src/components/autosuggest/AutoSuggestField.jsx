import React from 'react';

import Autosuggest from 'react-autosuggest';

import t from 'utils/tcomb-form';

const AutoSuggestField = t.form.Form.templates.textbox.clone({
	// override default implementation
	renderInput: (locals) => {
		const settings = locals.context[locals.path[0]];
		let getSuggestions = (input, callback) => {
			const regex = new RegExp('^' + input, 'i');
			const suggestions = settings.suggestions ? settings.suggestions.filter(str => regex.test(str)) : null;

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
			//placeholder: 'Enter search string...',
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