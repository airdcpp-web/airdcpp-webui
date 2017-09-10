import React from 'react';

import escapeStringRegexp from 'escape-string-regexp';

import './style.css';


const SuggestionRenderer = function (searchText, suggestionText, description = null) {
  const matchRegex = new RegExp('\\b' + escapeStringRegexp(searchText), 'i');

  const firstMatchIndex = suggestionText.search(matchRegex);

  let title = suggestionText;
  if (firstMatchIndex !== -1) {
    const beforeMatch = suggestionText.slice(0, firstMatchIndex);
    const match = suggestionText.slice(firstMatchIndex, firstMatchIndex + searchText.length);
    const afterMatch = suggestionText.slice(firstMatchIndex + searchText.length);

    title = (
      <span>
        {beforeMatch}
        <strong>
          {match}
        </strong>
        {afterMatch}
        <br />
      </span>
    );
  }

  return (
    <div className="content">
      <div className="header">
        { title }
      </div>
      { !!description && (
        <div className="description">
          { description }
        </div>
      ) }
    </div>
  );
};

export default SuggestionRenderer;
