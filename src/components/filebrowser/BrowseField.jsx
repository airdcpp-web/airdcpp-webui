import React from 'react';
import Button from 'components/semantic/Button';

import { FILE_BROWSER_MODAL } from 'constants/OverlayConstants';
import History from 'utils/History';

import t from 'utils/tcomb-form';

const BrowseField = t.form.Form.templates.textbox.clone({
	// override default implementation
	renderInput: (locals) => {
		let _input;
		const onConfirm = (path) => {
			locals.onChange(path);
		};

		const showBrowseDialog = () => {
			const { location } = locals.context;
			History.pushModal(location, location.pathname + '/browse', FILE_BROWSER_MODAL, {
				onConfirm: onConfirm,
				subHeader: locals.label,
				initialPath: locals.value ? locals.value : '',
			});
		};

		const onChange = (event) => {
			locals.onChange(event.target.value);
			setTimeout(_input.focus());
		};

		return (
			<div className="ui action fluid input field">
				<input
					ref={ input => { _input = input } }
					//name={locals.attrs.name}
					value={locals.value}
					onChange={onChange}
				/>
				<Button
					caption="Browse"
					onClick={showBrowseDialog}
				/>
			</div>
		);
	}
});

export default BrowseField;