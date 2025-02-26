import * as React from 'react';

import * as UI from '@/types/ui';

import { FormAccordion } from './AccordionField';

import tcomb from '@/utils/tcomb-form';

type TCombTemplate = {
  renderFieldset: (children: React.ReactNode, locals: UI.FormLocals) => React.ReactNode;
  renderLabel: (locals: UI.FormLocals) => React.ReactNode;
};

const AccordionStruct: TCombTemplate = {
  renderFieldset(children, locals) {
    const { label, ...childLocals } = locals;
    return (
      <FormAccordion locals={locals}>
        {(tcomb.form.Form.templates.struct as any).renderFieldset(children, childLocals)}
      </FormAccordion>
    );
  },
  renderLabel(locals) {
    return null;
  },
};

export default tcomb.form.Form.templates.struct.clone(AccordionStruct);
