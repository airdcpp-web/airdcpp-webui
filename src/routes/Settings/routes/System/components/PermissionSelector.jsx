'use strict';

import React from 'react';

import update from 'react-addons-update';
import t from 'utils/tcomb-form';

import Checkbox from 'components/semantic/Checkbox';
import Message from 'components/semantic/Message';

const ReactSelect = t.form.Form.templates.select.clone({
	renderSelect: (locals) => { // <- locals contains the "recipe" to build the UI
		const onChange = (access, checked) => {
			let values = locals.value;
			if (checked) {
				values = update(values, { $push: [ access ] });
			} else {
				const index = values.indexOf(access);
				values = update(values, { $splice: [ [ index, 1 ] ] });
			}

			locals.onChange(values);
		};

		const mapPermission = ({ value, text }) => (
			<Checkbox 
				key={ value }
				className={ value }
				checked={ locals.value.indexOf(value) !== -1 } 
				onChange={ checked => onChange(value, checked) }
				caption={ text }
			/>
		);

		const filterPermission = ({ value }) => {
			if (locals.value.indexOf('admin') !== -1 && value !== 'admin') {
				return false;
			}

			return true;
		};

		const permissions = locals.options
			.filter(filterPermission)
			.map(mapPermission);

		return (
			<div className="permission-select">
				<Message 
					description="Administrator permission is required in order to access the System section in settings"
					className="small"
				/>
				{ permissions }
			</div>
		);
	}
});

export default ReactSelect;
