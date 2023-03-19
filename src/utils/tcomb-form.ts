import t from '../components/form/tcomb/main';
import { FormContext } from 'types/ui';

export const Positive = t.refinement(t.Number, (n: number) => {
  return n >= 0 && n % 1 === 0;
});

export const Range = function (min: number | undefined, max: number | undefined) {
  const ret = t.refinement(t.Number, (n: number) => {
    if (min !== undefined && n < min) {
      return false;
    }

    if (max !== undefined && n > max) {
      return false;
    }

    return true;
  });

  ret.getValidationErrorMessage = (value, path, context: FormContext) => {
    if (min !== undefined && value < min) {
      return context.formT.t('minimumValueError', {
        defaultValue: 'Minimum allowed value is {{value}}',
        value: min,
      });
    }

    if (max !== undefined && value > max) {
      return context.formT.t('maximumValueError', {
        defaultValue: 'Maximum allowed value is {{value}}',
        value: max,
      });
    }

    return '';
  };

  return ret;
};

export default t;
