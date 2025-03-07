import * as React from 'react';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import tcomb from '@/utils/tcomb-form';

import { UserSelectField } from '@/components/select';

type TCombTemplate = {
  renderInput: (
    locals: UI.FormLocals<any, API.OfflineHintedUser | null, UI.EmptyObject>,
  ) => React.ReactNode;
};

const getErrorStyles = (hasError: boolean | undefined) =>
  !hasError
    ? undefined
    : {
        control: (props: any) => ({
          ...props,
          color: '#9f3a38',
          background: '#fff6f6',
          borderColor: '#e0b4b4',
          boxShadow: 'none',
        }),
        container: (props: any) => ({
          ...props,
          borderColor: '#9f3a38',
        }),
      };

const HintedUserTemplate: TCombTemplate = {
  renderInput(locals) {
    const { formT } = locals.context;

    const handleSubmit = (user: API.OfflineHintedUser) => {
      locals.onChange(user);
    };

    return (
      <UserSelectField
        onChange={handleSubmit}
        offlineMessage={formT.t('offlineMessage', 'No connected hubs')}
        styles={getErrorStyles(locals.hasError)}
        value={locals.value}
        isClearable={locals.typeInfo.isMaybe}
      />
    );
  },
};

export const HintedUserSelectField =
  tcomb.form.Form.templates.textbox.clone(HintedUserTemplate);
