import React from 'react';

import './style.css';

const SuggestionRenderer = function (input, suggestionValue, description = null) {
	const escapeRegexCharacters = (str) => {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	};

	const escapedInput = escapeRegexCharacters(input);
	const matchRegex = new RegExp('\\b' + escapedInput, 'i');

	const firstMatchIndex = suggestionValue.search(matchRegex);

	if (firstMatchIndex === -1) {
		return suggestionValue;
	}

	const beforeMatch = suggestionValue.slice(0, firstMatchIndex);
	const match = suggestionValue.slice(firstMatchIndex, firstMatchIndex + input.length);
	const afterMatch = suggestionValue.slice(firstMatchIndex + input.length);

	return (
		<div className="content">
			<div className="header">
				{beforeMatch}<strong>{match}</strong>{afterMatch}<br />
			</div>
			{ description ? (<div className="description">
				{ description }
			</div>) : null }
		</div>
	);
};

export default SuggestionRenderer;
