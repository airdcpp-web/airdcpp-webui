'use strict';
import React from 'react';

import Message from 'components/semantic/Message';
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
			const { currentMenuItem } = this.props;
			const children = React.cloneElement(this.props.children, {
				ref: 'children',
				onSettingsChanged: this.onSettingsChanged
			});

			let message;
			if (currentMenuItem.local) {
				message = (
					<Message 
						description="Settings listed on this page are browser-specific"
						icon="blue info"
					/>
				);
			}

			const saveButton = (!currentMenuItem.noSave ? (
				<SaveButton 
					saveHandler={ this.handleSave } 
					hasChanges={ this.state.hasChanges }
					className={ saveButtonClass }
					local={ currentMenuItem.local }
				/>
			) : null);

			return (
				<Component 
					{ ...this.props }
					saveButton={ saveButton }
					children={ children }
					message={ message }
				/>
			);
		},
	});

	return SaveDecorator;
};