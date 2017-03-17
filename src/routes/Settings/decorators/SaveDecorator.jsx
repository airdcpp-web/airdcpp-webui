'use strict';
import React from 'react';
import invariant from 'invariant';

import Message from 'components/semantic/Message';
import SaveButton from '../components/SaveButton';
import NotificationActions from 'actions/NotificationActions';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';
import { Lifecycle } from 'mixins/RouterMixin';


export default (Component, saveButtonClass = '') => {
	const SaveDecorator = React.createClass({
		propTypes: {
			currentMenuItem: React.PropTypes.object.isRequired,
			location: React.PropTypes.object,
		},

		mixins: [ Lifecycle ],

		contextTypes: {
			routerLocation: React.PropTypes.object,
		},

		childContextTypes: {
			onFieldChanged: React.PropTypes.func.isRequired,
			routerLocation: React.PropTypes.object.isRequired
		},

		componentWillMount() {
			this.forms = [];
			this.changedProperties = new Set();
		},

		getChildContext() {
			return {
				onFieldChanged: this.onSettingsChanged,
				routerLocation: this.context.routerLocation || this.props.location,
			};
		},

		getDefaultProps() {
			return {
				saveable: true
			};
		},

		componentWillReceiveProps(nextProps) {
			if (nextProps.currentMenuItem.url !== this.props.currentMenuItem.url) {
				this.changedProperties.clear();
			}
		},

		onSettingsChanged(id, value, hasChanges) {
			if (hasChanges) {
				this.changedProperties.add(id);
			} else {
				this.changedProperties.delete(id);
			}

			this.forceUpdate();
		},

		onSettingsSaved() {
			NotificationActions.success({ 
				title: 'Saving completed',
				message: 'Settings were saved successfully',
			});

			this.forceUpdate();
		},

		save() {
			const promises = refs.map(ref => this.refs[ref].save());
			this.changedProperties.clear();

			return Promise.all(promises);
		},

		handleSave() {
			const promises = this.forms.map(c => c.save());
			this.changedProperties.clear();

			return Promise.all(promises)
				.then(this.onSettingsSaved);
		},

		hasChanges() {
			return this.changedProperties.size > 0;
		},

		routerWillLeave(nextLocation) {
			// Are we opening a dialog?
			// Check later if this is fixed by https://github.com/reactjs/react-router/pull/3107
			if (nextLocation.pathname.indexOf(this.props.location.pathname) !== -1) {
				return null;
			}

			if (this.changedProperties.size > 0 && LoginStore.hasAccess(AccessConstants.SETTINGS_EDIT)) {
				return 'You have unsaved changes. Are you sure you want to leave?';
			}

			return null;
		},

		saveFormRef(c) {
			if (c) {
				invariant(c.hasOwnProperty('save'), 'Invalid setting form component supplied for SaveDecorator (save property missing)');
				this.forms.push(c);
			}
		},

		render() {
			const { currentMenuItem } = this.props;
			const children = React.cloneElement(this.props.children, {
				formRef: this.saveFormRef,
			});

			const message = currentMenuItem.local && (
				<Message 
					description="Settings listed on this page are browser-specific"
					icon="blue info"
				/>
			);

			const saveButton = !currentMenuItem.noSave && (
				<SaveButton 
					saveHandler={ this.handleSave } 
					hasChanges={ this.hasChanges() }
					className={ saveButtonClass }
					local={ currentMenuItem.local }
				/>
			);

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