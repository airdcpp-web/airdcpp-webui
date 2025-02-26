import { GroupBase } from 'react-select';
import Select, { AsyncProps as SelectProps } from 'react-select/async';

import * as UI from '@/types/ui';

export interface RemoteSelectFieldProps<SuggestionT extends object>
  extends SelectProps<SuggestionT, false, GroupBase<SuggestionT>> {
  formT: UI.ModuleTranslator;
}

export const RemoteSelectField = <SuggestionT extends object>({
  formT,
  ...other
}: RemoteSelectFieldProps<SuggestionT>) => {
  return (
    <Select<SuggestionT>
      noOptionsMessage={() => formT.translate('No options')}
      loadingMessage={() => formT.translate('Loading')}
      defaultOptions={[]}
      {...other}
    />
  );
};
