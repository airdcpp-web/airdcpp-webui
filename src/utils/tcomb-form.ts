//@ts-ignore
import t from 'tcomb-form';
import { FormContext } from 'types/ui';

import template from 'components/form/template';

t.form.Form.templates = template;

export const Positive = t.refinement(t.Number, (n: number) => {
  return n >= 0 && n % 1 === 0;
});


export const Range = function (min: number | undefined, max: number | undefined) {
  const ret = t.refinement(t.Number, (n: number) => {
    if (min && n < min) {
      return false;
    }

    if (max && n > max) {
      return false;
    }

    return true;
  });

  ret.getValidationErrorMessage = (value: number, path: string, context: FormContext) => {
    if (!!min && value < min) {
      return context.formT.t('minimumValueError', {
        defaultValue: 'Minimum allowed value is {{value}}',
        value: min
      });
    }

    if (!!max && value > max) {
      return context.formT.t('maximumValueError', {
        defaultValue: 'Maximum allowed value is {{value}}',
        value: max
      });
    }

    return null;
  };

  return ret;
};

export default t as any;

