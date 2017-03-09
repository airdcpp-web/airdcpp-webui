import React from 'react';

import ExtensionActions from 'actions/ExtensionActions';

import ActionButton from 'components/ActionButton';
import NpmPackageLayout from './NpmPackageLayout';

import { LocationContext } from 'mixins/RouterMixin';


const ExtensionBrowsePage = React.createClass({
	mixins: [ LocationContext ],
	render() {
		return (
			<div>
				<div className="table-actions">
					<ActionButton
						action={ ExtensionActions.installUrl }
						className="add"
					/>
				</div>
				<NpmPackageLayout 
					className="package-layout" 
				/>
			</div>
		);
	}
});

export default ExtensionBrowsePage;