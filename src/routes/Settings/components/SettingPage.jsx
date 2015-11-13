'use strict';

import React from 'react';
import SaveButton from './SaveButton';

const SettingPage = React.createClass({
	getInitialState() {
		return {
			hasChanges: false
		};
	},

	onSettingsChanged(hasChanges) {
		this.setState({ hasChanges: hasChanges });
	},

	handleSave() {
		return this.refs.children.save().finally(() => this.setState({ hasChanges: false }));
	},

	render() {
		return (
			<div className="ui segment">
				<div className="settings-page-header">
					<h2 className="ui header main-header">
						<i className={ this.props.icon + ' green icon' }></i>
						<div className="content">
							{ this.props.title }
						</div>
					</h2>
					<SaveButton saveHandler={this.handleSave} hasChanges={this.state.hasChanges}/>
				</div>
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