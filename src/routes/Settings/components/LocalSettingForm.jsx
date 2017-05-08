import PropTypes from 'prop-types';
import React from 'react';

import LocalSettingStore from 'stores/LocalSettingStore';

import Form from 'components/form/Form';


const LocalSettingForm = React.createClass({
	propTypes: {
		/**
		 * Form items to list
		 */
		keys: PropTypes.array.isRequired,
	},

	getInitialState() {
		this.definitions = LocalSettingStore.getDefinitions(this.props.keys);

		return {
			settings: LocalSettingStore.getState(),
		};
	},

	onSave(changedSettingArray) {
		this.setState({
			settings: LocalSettingStore.getState(),
		});

		return Promise.resolve(LocalSettingStore.setValues(changedSettingArray));
	},

	save() {
		return this.refs.form.save();
	},

	render: function () {
		const { settings } = this.state;
		const { formRef, ...otherProps } = this.props;
		return (
			<div className="local setting-form">
				<Form
					{ ...otherProps }
					ref={ formRef }
					onSave={ this.onSave }
					fieldDefinitions={ this.definitions }
					value={ settings }
				/>
			</div>
		);
	}
});

export default LocalSettingForm;