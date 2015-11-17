const t = require('tcomb-form');
t.form.Form.templates = require('tcomb-form/lib/templates/semantic');

t.Positive = t.refinement(t.Number, function (n) {
	return n >= 0 && n % 1 === 0;
});

export default t;

