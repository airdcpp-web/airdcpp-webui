import * as React from 'react';

import * as UI from '@/types/ui';

import Accordion, {
  AccordionContent,
  AccordionTitle,
} from '@/components/semantic/Accordion';
import IconConstants from '@/constants/IconConstants';
import Icon from '@/components/semantic/Icon';
import { isValueSet } from '@/utils/FormUtils';

type FormAccordionProps = React.PropsWithChildren<{
  locals: UI.FormLocals;
}>;

export const FormAccordion: React.FC<FormAccordionProps> = ({ locals, children }) => {
  const { label, attrs } = locals;
  const active = isValueSet(locals.value);
  return (
    <Accordion className="field" defaultActiveIndexes={active ? [0] : undefined}>
      <AccordionTitle id={attrs?.id}>
        <Icon icon={IconConstants.DROPDOWN} />
        <span style={active ? { fontWeight: 'bold' } : undefined}>{label}</span>
      </AccordionTitle>
      <AccordionContent id={attrs?.id}>{children}</AccordionContent>
    </Accordion>
  );
};
