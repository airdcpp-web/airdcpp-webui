import React from 'react';
import Button from 'components/semantic/Button';

import { FILE_BROWSER_MODAL } from 'constants/OverlayConstants';
import History from 'utils/History';

const t = require('tcomb-form');

const BrowseField = function (location, subHeader) { 
	class Component extends t.form.Textbox {
		getTemplate() {
			return (locals) => {
				const onConfirm = (path) => {
					locals.onChange(path);
				};

				const showBrowseDialog = () => {
					History.pushModal(location, location.pathname + '/browse', FILE_BROWSER_MODAL, {
						onConfirm: onConfirm,
						subHeader: subHeader,
						initialPath: locals.value,
					});
				};

				// handle error status
				let className = 'field browse';
				if (locals.hasError) {
					className += ' has-error';
				}

				return (
					<div className={className}>
						<label className="label">{locals.label}</label>
						<div className="ui action input field-button">
							<input
								name={locals.attrs.name}
								value={locals.value}
								onChange={locals.onChange}
							/>
							<Button
								caption="Browse"
								onClick={showBrowseDialog}
							/>
						</div>
					</div>
				);
			};
		}
	}

	return Component;
};

export default BrowseField;