'use strict';

import React from 'react';
import SaveButton from './SaveButton';
import NotificationActions from 'actions/NotificationActions';
import LayoutHeader from 'components/semantic/LayoutHeader';

const changedProperties = new Set();

const SettingPage = React.createClass({
	propTypes: {
		title: React.PropTypes.node.isRequired,
		icon: React.PropTypes.string.isRequired,
		saveable: React.PropTypes.bool,
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

	onSettingsChanged(id, value, hasChanges) {
		if (hasChanges) {
			changedProperties.add(...id);
		} else {
			changedProperties.delete(...id);
		}

		this.setState({ hasChanges: changedProperties.size > 0 });
	},

	onSettingsSaved() {
		NotificationActions.success({ 
			title: 'Saving completed',
			message: 'Settings were saved successfully',
		});
	},

	handleSave() {
		return this.refs.children.save().then(this.onSettingsSaved).finally(() => this.setState({ hasChanges: false }));
	},

	render() {
		const button = (this.props.saveable ? <SaveButton saveHandler={this.handleSave} hasChanges={this.state.hasChanges}/> : null);
		return (
			<div className="ui segment">
				<LayoutHeader
					className="settings-page-header"
					title={ this.props.title }
					icon={ this.props.icon + ' green' }
					subHeader={ this.props.subHeader }
					component={button}
				/>
				<div className="">
					{ 
						React.cloneElement(this.props.children, {
							ref: 'children',
							onSettingsChanged: this.onSettingsChanged
						}) 
					}
				</div>
			</div>
		);
	},
}); 

export default SettingPage;