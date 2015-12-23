'use strict';

import React from 'react';
import SaveButton from '../components/SaveButton';
import NotificationActions from 'actions/NotificationActions';


export default (Component, saveButtonClass = '') => {
	const SaveDecorator = React.createClass({
		propTypes: {
			currentMenuItem: React.PropTypes.object.isRequired,
		},

		getDefaultProps() {
			return {
				saveable: true
			};
		},

		getInitialState() {
			return {
				hasChanges: false
			};
		},

		componentWillReceiveProps(nextProps) {
			if (nextProps.currentMenuItem.url !== this.props.currentMenuItem.url) {
				this.setState({ hasChanges: false });
			}
		},

		onSettingsChanged(hasChanges) {
			this.setState({ hasChanges: hasChanges });
		},

		onSettingsSaved() {
			NotificationActions.success({ 
				title: 'Saving completed',
				message: 'Settings were saved successfully',
			});
		},

		handleSave() {
			this.setState({ hasChanges: false });
			return this.refs.children.save().then(this.onSettingsSaved);
		},

		render() {
			const children = React.cloneElement(this.props.children, {
				ref: 'children',
				onSettingsChanged: this.onSettingsChanged
			});

			const saveButton = (!this.props.currentMenuItem.noSave ? (
				<SaveButton 
					saveHandler={this.handleSave} 
					hasChanges={this.state.hasChanges}
					className={ saveButtonClass }
				/>
			) : null);

			return (
				<Component 
					{ ...this.props }
					saveButton={ saveButton }
					children={ children }
				/>
			);
		},
	});

	return SaveDecorator;
};