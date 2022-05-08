import { useEffect, useRef } from 'react';
import * as React from 'react';

import * as UI from 'types/ui';
import t from 'utils/tcomb-form';


interface IndeterminateCheckboxProps {
  locals: UI.FormLocals<any, boolean | null, UI.EmptyObject>;
}

const IndeterminateCheckbox: React.FC<IndeterminateCheckboxProps> = ({ locals }) => {
  const inputRef = useRef<HTMLInputElement>();

  useEffect(
    () => {
      if (!inputRef.current) {
        return;
      }

      if (typeof locals.value === 'boolean') {
        inputRef.current.indeterminate = false;
      } else {
        inputRef.current.indeterminate = true;
      }
    },
    [ locals.value ]
  );

  return (
    <input 
      ref={ inputRef }
      type="checkbox"
      {...locals.attrs}
      onChange={(evt) => {
        // Toggle between true/false/indeterminate
        if (locals.value === false) {
          locals.onChange(null);
        } else {
          locals.onChange(evt.target.checked);
        }
      }}
    />
  );
};

type TCombTemplate = { 
  renderCheckbox: (locals: UI.FormLocals<any, boolean | null, UI.EmptyObject>) => React.ReactNode; 
};

const IndeterminateCheckboxTemplate: TCombTemplate = {
  renderCheckbox(locals) {
    return (
      <IndeterminateCheckbox
        locals={ locals }
      />
    );
  }
};

export const IndeterminateCheckboxField = t.form.Form.templates.checkbox.clone(IndeterminateCheckboxTemplate);