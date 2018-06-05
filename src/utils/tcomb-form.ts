//@ts-ignore
import t from 'tcomb-form';

t.form.Form.templates = require('tcomb-form-templates-semantic');

t.Positive = t.refinement(t.Number, (n: number) => {
  return n >= 0 && n % 1 === 0;
});


t.Range = function (min: number, max: number) {
  const Range = t.refinement(t.Number, (n: number) => {
    if (min && n < min) {
      return false;
    }

    if (max && n > max) {
      return false;
    }

    return true;
  });

  Range.getValidationErrorMessage = (value: any, path: string, context: any) => {
    if (min && value < min) {
      return 'Minimum allowed value is ' + min;
    }

    if (max && value > max) {
      return 'Maximum allowed value is ' + max;
    }

    return null;
  };

  return Range;
};

export default t as any;

