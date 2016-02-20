import t from 'tcomb-form';

t.form.Form.templates = require('tcomb-form-templates-semantic');

t.Positive = t.refinement(t.Number, function (n) {
	return n >= 0 && n % 1 === 0;
});


t.Range = function (min, max) {
	const Range = t.refinement(t.Number, function (n) {
		if (min && n < min) {
			return false;
		}

		if (max && n > max) {
			return false;
		}

		return true;
	});

	Range.getValidationErrorMessage = function (value, path, context) {
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

export default t;

