import * as React from 'react';

import LocalSuggestField from 'components/autosuggest/LocalSuggestField';

import * as UI from 'types/ui';
import t from 'utils/tcomb-form';

interface AutoSuggestFieldConfig {
  alwaysList: boolean;
  suggestionGetter: () => string[];
}

type TCombTemplate = {
  renderInput: (
    locals: UI.FormLocals<any, string, AutoSuggestFieldConfig>,
  ) => React.ReactNode;
};

const AutoSuggestTemplate: TCombTemplate = {
  renderInput(locals) {
    return (
      <div className="ui fluid input">
        <LocalSuggestField
          placeholder={locals.attrs.placeholder}
          data={locals.config.suggestionGetter()}
          onChange={locals.onChange}
          defaultValue={locals.value ? locals.value : ''}
          alwaysRenderSuggestions={locals.config.alwaysList}
        />
      </div>
    );
  },
};

export const AutoSuggestField = t.form.Form.templates.textbox.clone(AutoSuggestTemplate);
