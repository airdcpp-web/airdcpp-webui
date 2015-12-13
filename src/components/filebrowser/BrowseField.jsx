import React from 'react';
import Button from 'components/semantic/Button';

import OverlayConstants from 'constants/OverlayConstants';
import History from 'utils/History';

import t from 'utils/tcomb-form';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';


const BrowseField = t.form.Form.templates.textbox.clone({
	// override default implementation
	renderInput: (locals) => {
		let _input;
		const onConfirm = (path) => {
			locals.onChange(path);
		};

		const showBrowseDialog = () => {
			const { location } = locals.context;
			History.pushModal(location, location.pathname + '/browse', OverlayConstants.FILE_BROWSER_MODAL, {
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
					ref={ input => { 
						_input = input;
					} }
					//name={locals.attrs.name}
					value={locals.value}
					onChange={onChange}
				/>
				{ LoginStore.hasAccess(AccessConstants.FILESYSTEM_VIEW) ? (
					<Button
						caption="Browse"
						onClick={showBrowseDialog}
					/>
				) : null }
			</div>
		);
	}
});

export default BrowseField;