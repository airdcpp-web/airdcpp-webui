import Select, { Props as SelectProps } from 'react-select/async';
import { OptionTypeBase } from 'react-select';

import * as UI from 'types/ui';


export interface RemoteSelectFieldProps<SuggestionT extends OptionTypeBase> extends SelectProps<SuggestionT> {
  formT: UI.ModuleTranslator;
}

export const RemoteSelectField = <SuggestionT extends OptionTypeBase>(
  { url, formT, ...other }: RemoteSelectFieldProps<SuggestionT>
) => {
  return (
    <Select<SuggestionT>
      noOptionsMessage={ () => formT.translate('No options') }
      loadingMessage={ () => formT.translate('Loading') }
      defaultOptions={[]}
      {...other}
    />
  );
};
