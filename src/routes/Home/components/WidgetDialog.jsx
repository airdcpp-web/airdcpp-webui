import React from 'react';

import Message from 'components/semantic/Message';
import Modal from 'components/semantic/Modal';

import IconConstants from 'constants/IconConstants';
import { RouteContext } from 'mixins/RouterMixin';

import Form from 'components/form/Form';
import { FieldTypes } from 'constants/SettingConstants';


const WidgetDialog = React.createClass({
	mixins: [ RouteContext ],

	propTypes: {
		/**
		 * Current widget settings
		 */
		settings: React.PropTypes.object, // Required

		/**
		 * Widget info object
		 */
		widgetInfo: React.PropTypes.object, // Required

		/**
		 * Called when the form is saved
		 */
		onSave: React.PropTypes.func, // Required
	},

	save() {
		return this.refs.form.save();
	},

	onSave(changedFields, value) {
		const { name, ...formSettings } = value;
		this.props.onSave({
			name,
			widget: formSettings
		});
		return Promise.resolve();
	},

	render: function () {
		const { widgetInfo, location, settings, ...overlayProps } = this.props;
		const { formSettings, name, icon } = widgetInfo;

		const Entry = [
			{
				key: 'name',
				type: FieldTypes.STRING,
				default_value: name,
			},
		];

		if (formSettings) {
			Entry.push(...formSettings);
		}

		return (
			<Modal 
				className="home-widget" 
				title={ name } 
				onApprove={ this.save }
				icon={ icon }
				location={ location }
				{ ...overlayProps }
			>
				<Form
					ref="form"
					value={ settings && {
						name: settings.name,
						...settings.widget,
					} }
					fieldDefinitions={ Entry }
					onSave={ this.onSave }
				/>

				<Message
					description="Widgets and their positions are browser-specific"
					icon={ IconConstants.INFO }
				/>
			</Modal>
		);
	}
});

export default WidgetDialog;