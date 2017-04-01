import React from 'react';

import { LocationContext } from 'mixins/RouterMixin';
import DataProviderDecorator from 'decorators/DataProviderDecorator';

import ExtensionConstants from 'constants/ExtensionConstants';

import Extension from './Extension';

import { Link } from 'react-router';
import Message from 'components/semantic/Message';


// The npm registry API returns different data/fieldnames for different calls
// so we must do some conversions (the primary data format is the one used by the package search method)
const convertNpmPackage = ({ name, description, version, _npmUser }) => {
	return {
		name,
		description,
		version,
		publisher: {
			username: _npmUser.name,
		}
	};
};

const LocalExtension = DataProviderDecorator(({ installedPackage, npmPackage, dataError }) => (
	<Extension 
		key={ installedPackage.name } 
		installedPackage={ installedPackage } 
		npmPackage={ npmPackage && convertNpmPackage(npmPackage) }
		npmError={ dataError }
	/>
), {
	urls: {
		npmPackage: ({ installedPackage }) => {
			if (installedPackage.private || !installedPackage.managed) {
				return Promise.resolve(null);
			}

			return $.getJSON(ExtensionConstants.NPM_PACKAGE_URL + installedPackage.name + '/latest');
		},
	},
	renderOnError: true,
});


const ExtensionsManagePage = React.createClass({
	mixins: [ LocationContext ],
	getItem(extension) {
		return (
			<LocalExtension 
				key={ extension.name } 
				installedPackage={ extension } 
			/>
		);
	},

	render() {
		const { installedPackages } = this.props;
		if (installedPackages.length === 0) {
			return (
				<Message 
					description={
						<span>
							No installed extensions were found. New extensions can be installed from the <Link to="/settings/extensions/packages">Extension catalog</Link> page.
						</span>
					}
					icon="blue info"
				/>
			);
		} 

		return (
			<div className="extension-layout">
				<div className="ui divider"/>
				<div className="ui divided items">
					{ installedPackages.map(this.getItem) }
				</div>
			</div>
		);
	}
});

export default DataProviderDecorator(ExtensionsManagePage, {
	urls: {
		installedPackages: ExtensionConstants.EXTENSIONS_URL,
	},
	onSocketConnected: (addSocketListener, { refetchData }) => {
		addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.ADDED, _ => refetchData());
		addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.REMOVED, _ => refetchData());
		addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.UPDATED, _ => refetchData());
	},
});
