import React from 'react';

import LocalSuggestField from 'components/autosuggest/LocalSuggestField';

import t from 'utils/tcomb-form';

import 'components/autosuggest/style.css';


const AutoSuggestField = t.form.Form.templates.textbox.clone({
  renderInput(locals: any) {
    return (
      <div className="ui fluid input">
        <LocalSuggestField 
          placeholder={ locals.attrs.placeholder }
          data={ locals.config.suggestionGetter() }
          onChange={ locals.onChange }
          defaultValue={ locals.value ? locals.value : '' }
          alwaysRenderSuggestions={ locals.config.alwaysList }
        />
      </div>
    );
  }
});

export default AutoSuggestField;