import React from 'react';
import Button from 'components/semantic/Button';

import { FILE_BROWSER_MODAL } from 'constants/OverlayConstants';
import History from 'utils/History';

const t = require('tcomb-form');

class BrowseField extends t.form.Component {
	getTemplate() {
		//const tmp = this;
		return (locals) => {
			const onConfirm = (path) => {
				locals.onChange(path);
			};

			const showBrowseDialog = () => {
				const { location } = this.props.options;
				History.pushModal(location, location.pathname + '/browse', FILE_BROWSER_MODAL, {
					onConfirm: onConfirm,
					subHeader: locals.label,
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
							ref="input"
							//name={locals.attrs.name}
							value={locals.value}
							onChange={(event) => { 
								locals.onChange(event.target.value);
								setTimeout(this.refs.input.focus());
							}}
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

export default BrowseField;